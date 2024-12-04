export interface MeasurementFormData {
  chest_cm: string;
  biceps_left_cm: string;
  biceps_right_cm: string;
  forearm_left_cm: string;
  forearm_right_cm: string;
  waist_cm: string;
  hips_cm: string;
  thigh_left_cm: string;
  thigh_right_cm: string;
  calf_left_cm: string;
  calf_right_cm: string;
}

export interface MeasurementHistory {
  measurement_date: string;
  [key: string]: any;
}