-- Fix template order by setting correct orderIndex based on template name
-- This ensures: Initial=0, Second Touch=1, Third Touch=2, Fourth Touch=3

UPDATE templates 
SET order_index = 0
WHERE template_name = 'Initial';

UPDATE templates 
SET order_index = 1
WHERE template_name = 'Second Touch';

UPDATE templates 
SET order_index = 2
WHERE template_name = 'Third Touch';

UPDATE templates 
SET order_index = 3
WHERE template_name = 'Fourth Touch';

-- Verify the changes
SELECT id, template_name, order_index, sequence_id 
FROM templates 
ORDER BY order_index;

