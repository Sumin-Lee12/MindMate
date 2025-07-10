import { Contact } from '../types/address-book-type';
import { useCallback, useEffect, useState } from 'react';
import { useAsyncDataGet } from '@/src/hooks/use-async-data-get';
import { getContactById } from '../services/get-contact-data';

export const useContactEditState = (id: string) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [memo, setMemo] = useState('');
  const getContactByIdCallback = useCallback(async () => {
    const contact = await getContactById(id);
    return contact;
  }, [id]);
  const { data, refetch } = useAsyncDataGet<Contact>(getContactByIdCallback);
  useEffect(() => {
    if (data) {
      setName(data.name);
      setPhoneNumber(data.phone_number);
      setMemo(data.memo);
    }
  }, [data]);
  return { name, phoneNumber, memo, setName, setPhoneNumber, setMemo, data, id, refetch };
};
