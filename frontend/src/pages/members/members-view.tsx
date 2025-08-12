import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/members/membersSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const MembersView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { members } = useAppSelector((state) => state.members)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View members')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View members')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/members/members-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>FirstName</p>
                    <p>{members?.first_name}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>LastName</p>
                    <p>{members?.last_name}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Email</p>
                    <p>{members?.email}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Status</p>
                    <p>{members?.status ?? 'No data'}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Role</p>

                        <p>{members?.role?.firstName ?? 'No data'}</p>

                </div>

                <>
                    <p className={'block font-bold mb-2'}>Contributions Member</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Amount</th>

                                <th>Date</th>

                            </tr>
                            </thead>
                            <tbody>
                            {members.contributions_member && Array.isArray(members.contributions_member) &&
                              members.contributions_member.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/contributions/contributions-view/?id=${item.id}`)}>

                                    <td data-label="amount">
                                        { item.amount }
                                    </td>

                                    <td data-label="date">
                                        { dataFormatter.dateTimeFormatter(item.date) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!members?.contributions_member?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Fines Member</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Amount</th>

                                <th>Reason</th>

                                <th>Date</th>

                            </tr>
                            </thead>
                            <tbody>
                            {members.fines_member && Array.isArray(members.fines_member) &&
                              members.fines_member.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/fines/fines-view/?id=${item.id}`)}>

                                    <td data-label="amount">
                                        { item.amount }
                                    </td>

                                    <td data-label="reason">
                                        { item.reason }
                                    </td>

                                    <td data-label="date">
                                        { dataFormatter.dateTimeFormatter(item.date) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!members?.fines_member?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Letters Member</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Title</th>

                                <th>DateSent</th>

                            </tr>
                            </thead>
                            <tbody>
                            {members.letters_member && Array.isArray(members.letters_member) &&
                              members.letters_member.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/letters/letters-view/?id=${item.id}`)}>

                                    <td data-label="title">
                                        { item.title }
                                    </td>

                                    <td data-label="date_sent">
                                        { dataFormatter.dateTimeFormatter(item.date_sent) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!members?.letters_member?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Loans Member</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Amount</th>

                                <th>Purpose</th>

                                <th>ApplicationDate</th>

                                <th>RepaymentDate</th>

                                <th>Status</th>

                            </tr>
                            </thead>
                            <tbody>
                            {members.loans_member && Array.isArray(members.loans_member) &&
                              members.loans_member.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/loans/loans-view/?id=${item.id}`)}>

                                    <td data-label="amount">
                                        { item.amount }
                                    </td>

                                    <td data-label="purpose">
                                        { item.purpose }
                                    </td>

                                    <td data-label="application_date">
                                        { dataFormatter.dateTimeFormatter(item.application_date) }
                                    </td>

                                    <td data-label="repayment_date">
                                        { dataFormatter.dateTimeFormatter(item.repayment_date) }
                                    </td>

                                    <td data-label="status">
                                        { item.status }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!members?.loans_member?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Welfare_contributions Member</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Amount</th>

                                <th>Date</th>

                            </tr>
                            </thead>
                            <tbody>
                            {members.welfare_contributions_member && Array.isArray(members.welfare_contributions_member) &&
                              members.welfare_contributions_member.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/welfare_contributions/welfare_contributions-view/?id=${item.id}`)}>

                                    <td data-label="amount">
                                        { item.amount }
                                    </td>

                                    <td data-label="date">
                                        { dataFormatter.dateTimeFormatter(item.date) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!members?.welfare_contributions_member?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/members/members-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

MembersView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default MembersView;
