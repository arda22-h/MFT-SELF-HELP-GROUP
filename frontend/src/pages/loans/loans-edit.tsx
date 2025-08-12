import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/loans/loansSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditLoansPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'amount': '',

    'purpose': '',

    application_date: new Date(),

    repayment_date: new Date(),

    member: null,

    status: '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { loans } = useAppSelector((state) => state.loans)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof loans === 'object') {
      setInitialValues(loans)
    }
  }, [loans])

  useEffect(() => {
      if (typeof loans === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (loans)[el])
          setInitialValues(newInitialVal);
      }
  }, [loans])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/loans/loans-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit loans')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit loans'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="Amount"
    >
        <Field
            type="number"
            name="amount"
            placeholder="Amount"
        />
    </FormField>

    <FormField
        label="Purpose"
    >
        <Field
            name="purpose"
            placeholder="Purpose"
        />
    </FormField>

      <FormField
          label="ApplicationDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.application_date ?
                  new Date(
                      dayjs(initialValues.application_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'application_date': date})}
          />
      </FormField>

      <FormField
          label="RepaymentDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.repayment_date ?
                  new Date(
                      dayjs(initialValues.repayment_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'repayment_date': date})}
          />
      </FormField>

  <FormField label='Member' labelFor='member'>
        <Field
            name='member'
            id='member'
            component={SelectField}
            options={initialValues.member}
            itemRef={'members'}

            showField={'first_name'}

        ></Field>
    </FormField>

    <FormField label="Status" labelFor="status">
        <Field name="status" id="status" component="select">

            <option value="Pending">Pending</option>

            <option value="Approved">Approved</option>

            <option value="Rejected">Rejected</option>

        </Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/loans/loans-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditLoansPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditLoansPage
