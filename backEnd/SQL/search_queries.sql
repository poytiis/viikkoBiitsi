--  Selects week's scores 
SELECT * FROM wpzl_postmeta WHERE post_id IN (SELECT post_id FROM wpzl_postmeta WHERE meta_key='_form_id' AND meta_value=5);
