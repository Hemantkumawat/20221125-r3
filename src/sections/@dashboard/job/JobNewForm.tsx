import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createJob } from 'src/redux/slices/job';

// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, TextField, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Job } from '../../../@types/job';
// components
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

const TYPE_OF_LOSS_OPTION = ['Fire', 'Water', 'Other'];
const LIVING_SPACE_OPTION = ['0-1000', '1001-2000', '2001-2900', '2900+'];
const NO_OF_FURNACE_OPTION = [1, 2, '3+'];
const ARRIVAL_TIME_OPTION = ['8-9 AM', '11 AM - 1 PM', '1-4 PM'];

const STATUS_OPTION = ['InProgress', 'Completed', 'Scheduled'];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

interface FormValuesProps extends Partial<Job> {
  taxes: boolean;
  inStock: boolean;
}

type Props = {
  isEdit: boolean;
  currentJob?: Job;
};

export default function JobNewForm({ isEdit, currentJob }: Props) {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const NewJobSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    contact: Yup.string().required('Description is required'),
    email: Yup.string().required('Email is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipcode: Yup.string().required('Zipcode is required'),
  });

  const defaultValues = useMemo(
    () => ({
      createdAt: currentJob?.createdAt || new Date(),
      name: currentJob?.name || '',
      contact: currentJob?.contact || '',
      email: currentJob?.email || '',
      address: currentJob?.address || '',
      city: currentJob?.city || '',
      state: currentJob?.state || '',
      zipcode: currentJob?.zipcode || '',
      type_of_loss: currentJob?.type_of_loss || '',
      living_space: currentJob?.living_space || '',
      no_of_furnace: currentJob?.no_of_furnace || 0,
      schedule_date: currentJob?.schedule_date || new Date(),
      arrival_time: currentJob?.arrival_time || '',
      status: currentJob?.status || STATUS_OPTION[0],
      How_to_enter_property: currentJob?.How_to_enter_property || '',
      is_emergency: currentJob?.is_emergency || false,
      is_dryer_vent_cleaning: currentJob?.is_dryer_vent_cleaning || false,
      is_PO_number: currentJob?.is_PO_number || false,
      PO_number: currentJob?.PO_number || '',
      is_rechout_to_owner: currentJob?.is_rechout_to_owner || false,
      comments: currentJob?.comments || '',
      air_duct_cleaning_quote: currentJob?.air_duct_cleaning_quote || 0,
      id: currentJob?.id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentJob]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewJobSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentJob) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentJob]);

  // useEffect(() => {
  //   dispatch(createJob());
  // }, [dispatch]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      await createJob(data);
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.job.list);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Full Name" />
              <Grid container>
                <Grid item md={6} sx={{ pr: 1 }}>
                  <RHFTextField name="email" label="Email address" />
                </Grid>
                <Grid item md={6} sx={{ pl: 1 }}>
                  <RHFTextField name="contact" label="Phone number" />
                </Grid>
              </Grid>

              <RHFTextField name="address" label="Address" />
              <Grid container>
                <Grid item md={4} sx={{ pr: 1 }}>
                  <RHFTextField name="city" label="City" />
                </Grid>
                <Grid item md={4} sx={{ pr: 1 }}>
                  <RHFTextField name="state" label="State" />
                </Grid>
                <Grid item md={4} sx={{ pr: 1 }}>
                  <RHFTextField name="zipcode" label="Zipcode" />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={6} sx={{ pr: 1 }}>
                  <RHFSelect
                    name="living_space"
                    label="Living Space in sq. Foot"
                    value={LIVING_SPACE_OPTION[0]}
                  >
                    {LIVING_SPACE_OPTION.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item md={6} sx={{ pl: 1 }}>
                  <RHFSelect name="no_of_furnace" label="No. Of Furnace">
                    {NO_OF_FURNACE_OPTION.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </RHFSelect>
                </Grid>
              </Grid>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <div>
                  <LabelStyle>Type of Loss</LabelStyle>
                  <RHFRadioGroup
                    name="type_of_loss"
                    options={TYPE_OF_LOSS_OPTION}
                    sx={{
                      '& .MuiFormControlLabel-root': { mr: 4 },
                    }}
                  />
                </div>
                <div>
                  <LabelStyle>Arrival Time</LabelStyle>
                  <RHFRadioGroup
                    name="arrival_time"
                    options={ARRIVAL_TIME_OPTION}
                    sx={{
                      '& .MuiFormControlLabel-root': { mr: 4 },
                    }}
                  />
                </div>
                <TextField
                  id="date"
                  label="Schedule Date"
                  type="date"
                  defaultValue="2022-11-25"
                  // sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Job' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
