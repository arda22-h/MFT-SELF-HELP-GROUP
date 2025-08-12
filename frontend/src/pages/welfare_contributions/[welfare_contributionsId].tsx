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

import { update, fetch } from '../../stores/welfare_contributions/welfare_contributionsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditWelfare_contributions = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'amount': '',

    member: null,

    date: new Date(),

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { welfare_contributions } = useAppSelector((state) => state.welfare_contributions)

  const { welfare_contributionsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: welfare_contributionsId }))
  }, [welfare_contributionsId])

  useEffect(() => {
    if (typeof welfare_contributions === 'object') {
      setInitialValues(welfare_contributions)
    }
  }, [welfare_contributions])

  useEffect(() => {
      if (typeof welfare_contributions === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (welfare_contributions)[el])

          setInitialValues(newInitialVal);
      }
  }, [welfare_contributions])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: welfare_contributionsId, data }))
    await router.push('/welfare_contributions/welfare_contributions-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit welfare_contributions')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit welfare_contributions'} main>
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

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/welfare_contributions/welfare_contributions-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditWelfare_contributions.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditWelfare_contributions
