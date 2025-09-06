import { body, param, query } from 'express-validator'


export const idParam = [
param('id').isMongoId().withMessage('invalid id')
]


const statusEnum = ['new', 'contacted', 'qualified', 'lost', 'converted']
const sourceEnum = ['unknown', 'website', 'referral', 'ads', 'social', 'event', 'outbound', 'other']


export const createLeadRules = [
body('firstName').isString().trim().notEmpty(),
body('lastName').optional().isString().trim(),
body('email').optional().isEmail().normalizeEmail(),
body('phone').optional().isString().trim(),
body('company').optional().isString().trim(),
body('title').optional().isString().trim(),
body('source').optional().isIn(sourceEnum),
body('status').optional().isIn(statusEnum),
body('owner').optional().isString().trim(),
body('value').optional().isFloat({ min: 0 }),
body('tags').optional().isArray()
]


export const updateLeadRules = [
body('firstName').optional().isString().trim(),
body('lastName').optional().isString().trim(),
body('email').optional().isEmail().normalizeEmail(),
body('phone').optional().isString().trim(),
body('company').optional().isString().trim(),
body('title').optional().isString().trim(),
body('source').optional().isIn(sourceEnum),
body('status').optional().isIn(statusEnum),
body('owner').optional().isString().trim(),
body('value').optional().isFloat({ min: 0 }),
body('tags').optional().isArray()
]


export const listLeadRules = [
query('page').optional().isInt({ min: 1 }),
query('limit').optional().isInt({ min: 1, max: 100 }),
query('sort').optional().isString(),
query('status').optional().isString(),
query('source').optional().isString(),
query('owner').optional().isString(),
query('minValue').optional().isFloat({ min: 0 }),
query('maxValue').optional().isFloat({ min: 0 }),
query('fromDate').optional().isISO8601(),
query('toDate').optional().isISO8601(),
query('tags').optional().isString()
]


export const activityRules = [
body('type').optional().isIn(['note', 'call', 'email', 'meeting', 'status-change']),
body('note').optional().isString(),
body('createdBy').optional().isString()
]


export const statusRules = [
body('status').isIn(statusEnum),
body('changedBy').optional().isString()
]


export const assignRules = [
body('owner').isString().trim(),
body('changedBy').optional().isString()
]


export const upsertRules = [
body('email').optional().isEmail().normalizeEmail(),
body('phone').optional().isString().trim(),
body('firstName').optional().isString().trim().notEmpty()
]