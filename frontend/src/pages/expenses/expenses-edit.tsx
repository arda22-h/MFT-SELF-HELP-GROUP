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

import { update, fetch } from '../../stores/expenses/expensesSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditExpensesPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'amount': '',

    'description': '',

    date: new Date(),

    category: '',

    approved_by: null,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { expenses } = useAppSelector((state) => state.expenses)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof expenses === 'object') {
      setInitialValues(expenses)
    }
  }, [expenses])

  useEffect(() => {
      if (typeof expenses === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (expenses)[el])
          setInitialValues(newInitialVal);
      }
  }, [expenses])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/expenses/expenses-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit expenses')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit expenses'} main>
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
        label="Description"
    >
        <Field
            name="description"
            placeholder="Description"
        />
    </FormField>

      <FormField
          label="Date"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.date ?
                  new Date(
                      dayjs(initialValues.date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'date': date})}
          />
      </FormField>

    <FormField label="Category" labelFor="category">
        <Field name="category" id="category" component="select">

            <option value="Operational">Operational</option>

            <option value="Project">Project</option>

            <option value="Miscellaneous">Miscellaneous</option>

        </Field>
    </FormField>

  <FormField label='ApprovedBy' labelFor='approved_by'>
        <Field
            name='approved_by'
            id='approved_by'
            component={SelectField}
            options={initialValues.approved_by}
            itemRef={'users'}

            showField={'firstName'}

        ></Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/expenses/expenses-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditExpensesPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditExpensesPage
