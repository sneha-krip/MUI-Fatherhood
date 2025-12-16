const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');
const { signupValidation, validate } = require('../middleware/validation');

/**
 * POST /api/fatherhood/signup
 * Register a new participant for the Fatherhood Initiative
 */
router.post('/signup', signupValidation, validate, async (req, res) => {
    try {
        const { 
            full_name, 
            email, 
            phone_number, 
            address, 
            zip_code, 
            number_of_children, 
            children_ages, 
            referral_source, 
            interests, 
            availability, 
            additional_notes, 
            consent_to_contact, 
            consent_to_sms 
        } = req.body;

        // Check for existing email
        const { data: existing, error: checkError } = await supabase
            .from('fatherhood_signups')
            .select('id')
            .ilike('email', email)
            .maybeSingle();

        if (checkError) {
            console.error('Email check error:', checkError);
        }

        if (existing) {
            return res.status(409).json({ 
                error: 'Email already registered',
                message: 'This email is already signed up for the Fatherhood Initiative. If you need to update your information, please contact fatherhood@manupinc.org'
            });
        }

        // Insert new signup
        const { data, error } = await supabase
            .from('fatherhood_signups')
            .insert([{
                full_name,
                email: email.toLowerCase(),
                phone_number,
                address: address || null,
                zip_code: zip_code || null,
                number_of_children: number_of_children || null,
                children_ages: children_ages || null,
                referral_source: referral_source || null,
                interests: interests || null,
                availability: availability || null,
                additional_notes: additional_notes || null,
                consent_to_contact: consent_to_contact !== false,
                consent_to_sms: consent_to_sms || false,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            
            // Handle unique constraint violation
            if (error.code === '23505') {
                return res.status(409).json({ 
                    error: 'Email already registered',
                    message: 'This email is already signed up.'
                });
            }
            
            return res.status(500).json({ 
                error: 'Failed to save signup',
                message: 'We couldn\'t process your signup. Please try again or contact fatherhood@manupinc.org'
            });
        }

        console.log(`✅ New Fatherhood signup: ${data.full_name} (${data.email})`);

        // Success response
        res.status(201).json({
            success: true,
            message: 'Thank you for signing up for the Fatherhood Initiative!',
            data: {
                full_name: data.full_name,
                email: data.email,
                signup_date: data.signup_date
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            error: 'Server error',
            message: 'An unexpected error occurred. Please try again.'
        });
    }
});

/**
 * GET /api/fatherhood/signups
 * Get all signups (admin only - requires service key)
 */
router.get('/signups', async (req, res) => {
    try {
        if (!supabaseAdmin) {
            return res.status(503).json({ 
                error: 'Admin access not configured',
                message: 'SUPABASE_SERVICE_KEY is required for this endpoint'
            });
        }

        const { status, limit = 50, offset = 0 } = req.query;
        
        let query = supabaseAdmin
            .from('fatherhood_signups')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
        
        if (status) {
            query = query.eq('status', status);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Fetch signups error:', error);
            throw error;
        }

        res.json({
            success: true,
            data,
            pagination: {
                total: count,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + data.length) < count
            }
        });

    } catch (error) {
        console.error('Get signups error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch signups',
            message: 'Could not retrieve signup data'
        });
    }
});

/**
 * GET /api/fatherhood/signups/:id
 * Get a specific signup by ID
 */
router.get('/signups/:id', async (req, res) => {
    try {
        if (!supabaseAdmin) {
            return res.status(503).json({ 
                error: 'Admin access not configured'
            });
        }

        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('fatherhood_signups')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ 
                error: 'Signup not found'
            });
        }

        res.json({ success: true, data });

    } catch (error) {
        console.error('Get signup error:', error);
        res.status(500).json({ error: 'Failed to fetch signup' });
    }
});

/**
 * PATCH /api/fatherhood/signups/:id/status
 * Update signup status
 */
router.patch('/signups/:id/status', async (req, res) => {
    try {
        if (!supabaseAdmin) {
            return res.status(503).json({ 
                error: 'Admin access not configured'
            });
        }

        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'contacted', 'enrolled', 'inactive', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: 'Invalid status',
                validStatuses
            });
        }

        const { data, error } = await supabaseAdmin
            .from('fatherhood_signups')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        console.log(`📝 Updated signup ${id} status to: ${status}`);

        res.json({ success: true, data });

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

/**
 * GET /api/fatherhood/stats
 * Get signup statistics
 */
router.get('/stats', async (req, res) => {
    try {
        if (!supabaseAdmin) {
            return res.status(503).json({ 
                error: 'Admin access not configured'
            });
        }

        // Get total count
        const { count: total } = await supabaseAdmin
            .from('fatherhood_signups')
            .select('*', { count: 'exact', head: true });

        // Get counts by status
        const { data: statusData } = await supabaseAdmin
            .from('fatherhood_signups')
            .select('status');

        const statusCounts = statusData?.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
        }, {}) || {};

        // Get this week's signups
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const { count: thisWeek } = await supabaseAdmin
            .from('fatherhood_signups')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', weekAgo.toISOString());

        res.json({
            success: true,
            stats: {
                total,
                thisWeek,
                byStatus: statusCounts
            }
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;

