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

import { update, fetch } from '../../stores/bank_accounts/bank_accountsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditBank_accountsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'account_name': '',

    'account_number': '',

    'balance': '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { bank_accounts } = useAppSelector((state) => state.bank_accounts)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof bank_accounts === 'object') {
      setInitialValues(bank_accounts)
    }
  }, [bank_accounts])

  useEffect(() => {
      if (typeof bank_accounts === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (bank_accounts)[el])
          setInitialValues(newInitialVal);
      }
  }, [bank_accounts])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/bank_accounts/bank_accounts-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit bank_accounts')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit bank_accounts'} main>
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
        label="AccountName"
    >
        <Field
            name="account_name"
            placeholder="AccountName"
        />
    </FormField>

    <FormField
        label="AccountNumber"
    >
        <Field
            name="account_number"
            placeholder="AccountNumber"
        />
    </FormField>

    <FormField
        label="Balance"
    >
        <Field
            type="number"
            name="balance"
            placeholder="Balance"
        />
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/bank_accounts/bank_accounts-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditBank_accountsPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditBank_accountsPage
