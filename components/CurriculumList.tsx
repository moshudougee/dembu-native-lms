import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native'
import React from 'react'
import { CurriculumData, CurriculumItem } from '@/types/types';

interface CurriculumListProps {
    curriculumData: CurriculumData | undefined;
    isLoading: boolean;
    onLoadMore: () => void;
}

const CurriculumList: React.FC<CurriculumListProps> = ({
    curriculumData,
    isLoading,
    onLoadMore,
}) => {

    const renderItem = ({ item }: { item: CurriculumItem }) => (
        <View className='border-b border-[#eee] p-4'>
            {item._class === "chapter" ? (
                <Text
                 className='text-xl'
                 style={{ fontFamily: 'BarlowBold' }}
                >
                    {item.title}
                </Text>
            ) : (
                <View>
                    <Text
                     className='text-xl ml-4'
                     style={{ fontFamily: 'BarlowSemiBold' }}
                    >
                        {item.title}
                    </Text>
                    
                    {item._class === 'lecture' && (
                        <Text
                         className='pl-4 text-blue-700'
                         style={{ fontFamily: 'BarlowSemiBold' }}
                        >
                            {item.is_free ? 'Free' : 'Paid'}
                        </Text>
                    )}

                    {item._class === 'lecture' && (
                        <Text
                         className='pl-4'
                         style={{ fontFamily: 'BarlowSemiBold' }}
                        >
                            Quiz
                        </Text>
                    )}
                </View>
            )}
        </View>
    )

    const renderFooter = () => {
        if (!isLoading) return null

        return (
            <View className='p-12'>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        )
    }

  if (!curriculumData && !isLoading) {
    return (
        <Text>No curriculum data available.</Text>
    )
  }
  return (
    <View>
      <Text
        className='text-2xl'
        style={{ fontFamily: 'BarlowExtraBold' }}
      >
            Course Curriculum: {curriculumData?.count} Items
      </Text>

      <FlatList 
        nestedScrollEnabled={true}
        scrollEnabled={false}
        data={curriculumData?.results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={renderFooter}
      />

      {curriculumData?.next && !isLoading && (
        <Pressable
            onPress={onLoadMore}
            className='bg-blue-700 rounded-2xl py-4 items-center mt-12'
        >
            <Text className='text-white text-lg'>Load More Curriculum</Text>
        </Pressable>
      )}
    </View>
  )
}

export default CurriculumList