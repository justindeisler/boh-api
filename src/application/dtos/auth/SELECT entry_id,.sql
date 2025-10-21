SELECT entry_id,
       glucose_value,
       glucose_unit,
       trend,
       device_id,
       device_serial,
       sensor_age_minutes,
       is_real_time,
       collection_method
FROM public.cgm_readings
LIMIT 1000;