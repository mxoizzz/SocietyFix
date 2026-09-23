-- Seed Data for SocietyFix Dashboard
-- This script safely injects 5 realistic issues into your primary society so you can see the dashboard charts work!

DO $$
DECLARE
  v_society_id UUID;
  v_issue1_id UUID;
  v_issue2_id UUID;
  v_issue3_id UUID;
  v_issue4_id UUID;
  v_issue5_id UUID;
BEGIN
  -- 1. Grab the ID of the society you just registered
  SELECT id INTO v_society_id FROM public.societies LIMIT 1;
  
  IF v_society_id IS NULL THEN
    RAISE EXCEPTION 'No society found! Please register a secretary account first so a society exists.';
  END IF;

  -- ==========================================
  -- ISSUE 1: In Progress Plumbing Issue
  -- ==========================================
  INSERT INTO public.issues (society_id, title, description, flat_number, category, status, reporter_name, created_at, updated_at)
  VALUES (
    v_society_id,
    'Low water pressure on upper floors',
    'Water pressure drops sharply between 7:00 and 9:00 am in flats above the seventh floor. Residents in B wing are unable to use showers concurrently.',
    'B-902', 'plumbing', 'in_progress', 'Priya Nair', now() - interval '2 days', now() - interval '12 hours'
  ) RETURNING id INTO v_issue1_id;

  -- Add timeline and notes
  INSERT INTO public.issue_status_events (issue_id, status, actor, created_at) VALUES (v_issue1_id, 'reported', 'Priya Nair', now() - interval '2 days');
  INSERT INTO public.issue_status_events (issue_id, status, actor, created_at) VALUES (v_issue1_id, 'in_progress', 'Admin', now() - interval '1 day');
  INSERT INTO public.issue_notes (issue_id, text, author, created_at) VALUES (v_issue1_id, 'Pump contractor inspected the pressure valves. Replacement parts are expected tomorrow.', 'Secretary', now() - interval '12 hours');


  -- ==========================================
  -- ISSUE 2: New Urgent Security Issue
  -- ==========================================
  INSERT INTO public.issues (society_id, title, description, flat_number, category, status, reporter_name, created_at, updated_at)
  VALUES (
    v_society_id,
    'Main gate intercom not connecting to flats',
    'The visitor intercom at the main gate rings but does not connect to flats in A and C wings. Security is calling residents on personal numbers.',
    'A-304', 'security', 'reported', 'Rohan Shah', now() - interval '3 hours', now() - interval '3 hours'
  ) RETURNING id INTO v_issue2_id;

  INSERT INTO public.issue_status_events (issue_id, status, actor, created_at) VALUES (v_issue2_id, 'reported', 'Rohan Shah', now() - interval '3 hours');


  -- ==========================================
  -- ISSUE 3: Resolved Electrical Issue
  -- ==========================================
  INSERT INTO public.issues (society_id, title, description, flat_number, category, status, reporter_name, created_at, updated_at)
  VALUES (
    v_society_id,
    'Basement lights flickering near ramp',
    'Three tube lights near the basement entry ramp flicker continuously after 6 pm, reducing visibility for vehicles entering the parking area.',
    'C-1102', 'electrical', 'resolved', 'Nisha Kapoor', now() - interval '5 days', now() - interval '1 day'
  ) RETURNING id INTO v_issue3_id;

  INSERT INTO public.issue_status_events (issue_id, status, actor, created_at) VALUES (v_issue3_id, 'reported', 'Nisha Kapoor', now() - interval '5 days');
  INSERT INTO public.issue_status_events (issue_id, status, actor, created_at) VALUES (v_issue3_id, 'in_progress', 'Admin', now() - interval '4 days');
  INSERT INTO public.issue_status_events (issue_id, status, actor, created_at) VALUES (v_issue3_id, 'resolved', 'Admin', now() - interval '1 day');
  INSERT INTO public.issue_notes (issue_id, text, author, created_at) VALUES (v_issue3_id, 'Electrician has isolated the affected circuit and replaced the failing components. Tested successfully.', 'Secretary', now() - interval '1 day');


  -- ==========================================
  -- ISSUE 4: In Progress Cleanliness Issue
  -- ==========================================
  INSERT INTO public.issues (society_id, title, description, flat_number, category, status, reporter_name, created_at, updated_at)
  VALUES (
    v_society_id,
    'Overflowing planter after irrigation',
    'The planter beside the C-wing lobby overflows onto the walkway each morning after the irrigation cycle. Mud is spreading.',
    'C-302', 'cleanliness', 'in_progress', 'Ishita Sen', now() - interval '1 day', now() - interval '5 hours'
  ) RETURNING id INTO v_issue4_id;

  INSERT INTO public.issue_status_events (issue_id, status, actor, created_at) VALUES (v_issue4_id, 'reported', 'Ishita Sen', now() - interval '1 day');
  INSERT INTO public.issue_status_events (issue_id, status, actor, created_at) VALUES (v_issue4_id, 'in_progress', 'Admin', now() - interval '5 hours');
  INSERT INTO public.issue_notes (issue_id, text, author, created_at) VALUES (v_issue4_id, 'Notified the gardening agency to adjust the sprinkler timers in that zone.', 'Secretary', now() - interval '4 hours');


  -- ==========================================
  -- ISSUE 5: New Electrical Issue
  -- ==========================================
  INSERT INTO public.issues (society_id, title, description, flat_number, category, status, reporter_name, created_at, updated_at)
  VALUES (
    v_society_id,
    'Lift stops unevenly on fifth floor',
    'The A-wing lift stops a few centimetres below the fifth-floor landing, creating a severe tripping risk for senior residents.',
    'A-503', 'electrical', 'reported', 'Devika Rao', now() - interval '10 hours', now() - interval '10 hours'
  ) RETURNING id INTO v_issue5_id;

  INSERT INTO public.issue_status_events (issue_id, status, actor, created_at) VALUES (v_issue5_id, 'reported', 'Devika Rao', now() - interval '10 hours');

END $$;
