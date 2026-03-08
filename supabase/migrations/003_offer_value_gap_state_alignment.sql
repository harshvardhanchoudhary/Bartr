-- Align offer value_gap_state constraint with app-level naming
-- Old values: under / big_under / big_over
-- New values: short / way_short / way_over

alter table offers
  drop constraint if exists offers_value_gap_state_check;

alter table offers
  add constraint offers_value_gap_state_check
  check (value_gap_state in ('fair','short','over','way_short','way_over'));
