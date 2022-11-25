import { sentenceCase } from 'change-case';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';

import {
  Box,
  Card,
  Table,
  Button,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';

// redux
import { useDispatch, useSelector } from '../../redux/store';

// utils
import { fDate } from '../../utils/formatTime';
import { fCurrency } from '../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// @types
import { Job } from '../../@types/job';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections

import ListHead from 'src/sections/@dashboard/job/list/ListHead';
import ListToolbar from 'src/sections/@dashboard/job/list/ListToolbar';
import MoreMenu from 'src/sections/@dashboard/job/list/MoreMenu';
import { deleteJob, getJobs, updateJob } from 'src/redux/slices/job';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'email', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'createdAt', label: 'Create at', alignRight: false },
  { id: '' },
];

const ICON = {
  mr: 2,
  width: 20,
  height: 20,
};
// ----------------------------------------------------------------------

export default function JobList() {
  const { themeStretch } = useSettings();

  const theme = useTheme();

  const dispatch = useDispatch();

  const { jobs } = useSelector((state) => state.job);

  const [jobList, setJobList] = useState<Job[]>([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [selected, setSelected] = useState<string[]>([]);

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [orderBy, setOrderBy] = useState('createdAt');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  useEffect(() => {
    if (jobs.length) {
      setJobList(jobs);
    }
  }, [jobs]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const selected = jobList.map((n) => n.name);
      setSelected(selected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleDeleteJobs = (selected: string[]) => {
    const deleteJobs = jobList.filter((job) => !selected.includes(job.name));
    setSelected([]);
    setJobList(deleteJobs);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - jobList.length) : 0;

  const filteredJobs = applySortFilter(jobList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredJobs.length && Boolean(filterName);
  const onDelete = async (id: any) => {
    try {
      await deleteJob(id);
      dispatch(getJobs());
      enqueueSnackbar('Job Deleted successfully!');
    } catch (error) {
      console.error(error);
    }
  };
  const handleStatusChange = async (event: any, id: any) => {
    try {

      console.log('event.currentTarget.value', event.target.value);
      await updateJob({ status: event.target.value }, id);
      dispatch(getJobs());
      enqueueSnackbar('Job Status updated successfully!');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Page title="Job: Job List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Job List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'job',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Job List' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.job.new}
            >
              New Job
            </Button>
          }
        />

        <Card>
          <ListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteJobs={() => handleDeleteJobs(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={jobList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {filteredJobs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, name, email, address, status, createdAt } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{email}</TableCell>

                          <TableCell style={{ minWidth: 160 }}>{address}</TableCell>
                          <TableCell style={{ minWidth: 160 }}>
                            {/* {status} */}
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={status}
                              size="small"
                              onChange={(event) => handleStatusChange(event, id)}
                            >
                              <MenuItem value={status}>{status}</MenuItem>
                              <MenuItem value="InProgress">InProgress</MenuItem>
                              <MenuItem value="Completed">Completed</MenuItem>
                              <MenuItem value="Scheduled">Scheduled</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell style={{ minWidth: 160 }}>{fDate(createdAt)}</TableCell>

                          <TableCell align="right">
                            <IconButton
                              onClick={(event) => onDelete(id)}
                              sx={{ color: 'error.main' }}
                            >
                              <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
                            </IconButton>

                            {/* <MoreMenu
                              jobName={name}
                              jobId={id}
                              onDelete={() => handleDeleteJob(id.toString())}
                            /> */}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={jobList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, value) => setPage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Anonymous = Record<string | number, string>;

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array: Job[], comparator: (a: any, b: any) => number, query: string) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return array.filter((_job) => _job.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}
