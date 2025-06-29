import { Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';
import Button from '../../../src/components/ui/button';
// import { createDb } from '../../../src/lib/db/db';

const SearchForm = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [detailLocation, setDetailLocation] = useState('');

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await createDb();
  //   };
  //   fetchData();
  // }, []);

  // const handleSubmit = async () => {
  //   const MindMateDb = await createDb();
  //   await MindMateDb.runAsync(
  //     `
  //       INSERT INTO items (name, category, location, detail_location)
  //       VALUES (?, ?, ?, ?)
  //     `,
  //     [name, category, location, detailLocation],
  //   );

  //   console.log(await MindMateDb.getAllAsync('SELECT * FROM items'));
  // };

  // const handleDelete = async () => {
  //   const MindMateDb = await createDb();
  //   await MindMateDb.runAsync('DELETE FROM items');

  //   console.log(await MindMateDb.getAllAsync('SELECT * FROM items'));
  // };

  return (
    <View className="h-full flex-1 items-center justify-center bg-white">
      <TextInput
        className="border-gray-300 mb-4 h-12 w-3/4 rounded-lg border px-4"
        placeholder="물건 이름"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="border-gray-300 mb-4 h-12 w-3/4 rounded-lg border px-4"
        placeholder="카테고리"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        className="border-gray-300 mb-4 h-12 w-3/4 rounded-lg border px-4"
        placeholder="간략한 위치"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        className="border-gray-300 mb-4 h-12 w-3/4 rounded-lg border px-4"
        placeholder="상세 위치"
        value={detailLocation}
        onChangeText={setDetailLocation}
      />
      <Button className="w-3/4 rounded-lg bg-blue-500 px-4 py-2" onPress={handleSubmit}>
        <Text>제출</Text>
      </Button>
      <Button className="w-3/4 rounded-lg bg-blue-500 px-4 py-2" onPress={handleDelete}>
        <Text>전체 삭제</Text>
      </Button>
    </View>
  );
};

export default SearchForm;
