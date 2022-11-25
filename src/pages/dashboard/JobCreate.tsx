import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getJobs } from '../../redux/slices/job';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import JobNewForm from '../../sections/@dashboard/job/JobNewForm';

// ----------------------------------------------------------------------

export default function JobCreate() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const { jobs } = useSelector((state) => state.job);

  const isEdit = pathname.includes('edit');

  const currentJob = jobs.find((job) => paramCase(job.name) === name);

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  return (
    <Page title="Job: Create a new job">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new Job' : 'Edit job'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Job',
              href: PATH_DASHBOARD.job.root,
            },
            { name: !isEdit ? 'New Job' : name },
          ]}
        />

        <JobNewForm isEdit={isEdit} currentJob={currentJob} />
      </Container>
    </Page>
  );
}
