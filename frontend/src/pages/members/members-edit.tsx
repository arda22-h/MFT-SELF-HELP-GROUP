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

import { update, fetch } from '../../stores/members/membersSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditMembersPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'first_name': '',

    'last_name': '',

    'email': '',

    status: '',

    role: null,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { members } = useAppSelector((state) => state.members)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof members === 'object') {
      setInitialValues(members)
    }
  }, [members])

  useEffect(() => {
      if (typeof members === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (members)[el])
          setInitialValues(newInitialVal);
      }
  }, [members])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/members/members-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit members')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit members'} main>
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
        label="FirstName"
    >
        <Field
            name="first_name"
            placeholder="FirstName"
        />
    </FormField>

    <FormField
        label="LastName"
    >
        <Field
            name="last_name"
            placeholder="LastName"
        />
    </FormField>

    <FormField
        label="Email"
    >
        <Field
            name="email"
            placeholder="Email"
        />
    </FormField>

    <FormField label="Status" labelFor="status">
        <Field name="status" id="status" component="select">

            <option value="Pending">Pending</option>

            <option value="Approved">Approved</option>

            <option value="Suspended">Suspended</option>

        </Field>
    </FormField>

  <FormField label='Role' labelFor='role'>
        <Field
            name='role'
            id='role'
            component={SelectField}
            options={initialValues.role}
            itemRef={'users'}

            showField={'firstName'}

        ></Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/members/members-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditMembersPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditMembersPage
