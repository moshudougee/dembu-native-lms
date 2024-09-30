import { View, Text, TextInput, Pressable, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SearchResponse } from '@/types/types';
import axios from 'axios';
import { password, username } from '@/utils/apikeys';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native';
import CourseItem from '@/components/CourseItem';

const fetchCourses = async (searchTerm: string): Promise<SearchResponse> => {
  // Simulated API call
  const response = await axios.get(`https://www.udemy.com/api-2.0/courses`, {
    params: {
      search: searchTerm,
    },
    auth: {
      username: username,
      password: password,
    }
  }
  );
  return response.data;
}

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['searchCourses', searchQuery],
    queryFn: () => fetchCourses(searchQuery),
    enabled: true,
  })

  const handleSearch = () => {
    setSearchQuery(searchTerm)
    refetch()
  }

  return (
    <View className='flex-1 py-12 bg-white'>
      <View className='p-4'>
        <View className='flex-row mb-4 w-full border-2 border-neutral-400 rounded-2xl overflow-hidden bg-white'>
          <TextInput 
            className='p-2 w-3/4'
            placeholder='Search courses'
            placeholderTextColor='gray'
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Pressable
            onPress={handleSearch}
            className='bg-blue-700 w-1/4 justify-center items-center'
          >
            <Text className='text-white' style={{ fontFamily: 'BarlowBold' }}>
              Search
            </Text>
          </Pressable>
        </View>

        {
          isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size='large' color="#2563eb" />
            </View>
          ) : error ? (
            <Text>Error: {(error as Error).message}</Text>
          ) : data?.results ? (
            <FlatList
              data={data?.results}
              renderItem={({item, index}) => (
                <CourseItem course={item} index={index} />
              )}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text>No courses found. Try searching for a different course.</Text>
            </View>
          )
        }
      </View>
      
    </View>
  )
}

export default Explore