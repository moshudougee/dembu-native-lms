import { View, Text, Image, Pressable, ListRenderItem, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Course, CurriculumData, CurriculumItem, Review } from '@/types/types';
import axios from 'axios';
import { password, username } from '@/utils/apikeys';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Ionicons } from '@expo/vector-icons';
import CurriculumList from '@/components/CurriculumList';
import { ActivityIndicator } from 'react-native';

const fetchCourseDetail = async (courseId: string): Promise<Course> => {
    // Simulated API call
    const response = await axios.get<Course>(`https://www.udemy.com/api-2.0/courses/${courseId}`, {
      auth: {
        username: username,
        password:  password,
      }
    });
    return response.data;
}

const fetchCourseCarriculum = async (courseId: string, page: number): Promise<CurriculumData> => {
    // Simulated API call
    const response = await axios.get<CurriculumData>(
        `https://www.udemy.com/api-2.0/courses/${courseId}/public-curriculum-items/?page=${page}`, {
      auth: {
        username: username,
        password:  password,
      }
    });
    return response.data;
}

const fetchCourseReviews = async (courseId: string): Promise<any> => {
    // Simulated API call
    const response = await axios.get(`https://www.udemy.com/api-2.0/courses/${courseId}/reviews`, {
      auth: {
        username: username,
        password:  password,
      }
    });
    return response.data;
}

const SegmentedControl: React.FC<{
    selectedSegment: "curriculum" | "reviews";
    onSegmentChange: (segment: "curriculum" | "reviews") => void;
}> = ({selectedSegment, onSegmentChange}) => {
    return (
        <View className='flex-row mb-4 bg-gray-200 rounded-lg p-1 mt-6'>
            {/***Curriculum */}
            <Pressable
                onPress={() => onSegmentChange('curriculum')}
                className={`flex-1 py-3 rounded-md ${
                    selectedSegment === "curriculum" ? "bg-blue-700" : 'bg-transparent'
                }`}
            >
                <Text
                    className={`text-center ${
                        selectedSegment === 'curriculum' ? 'text-white' : 'text-gray-700'
                    }`}
                    style={{
                        fontFamily:
                            selectedSegment === 'curriculum' ? 'BarlowBold' : 'BarlowMedium',
                    }}
                >
                    Curriculum
                </Text>
            </Pressable>
            {/***Reviews */}
            <Pressable
                onPress={() => onSegmentChange('reviews')}
                className={`flex-1 py-3 rounded-md ${
                    selectedSegment === "reviews" ? "bg-blue-700" : 'bg-transparent'
                }`}
            >
                <Text
                    className={`text-center ${
                        selectedSegment === 'reviews' ? 'text-white' : 'text-gray-700'
                    }`}
                    style={{
                        fontFamily:
                            selectedSegment === 'reviews' ? 'BarlowBold' : 'BarlowMedium',
                    }}
                >
                    Reviews
                </Text>
            </Pressable>
        </View>
    )
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <View className='flex-row'>
            {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons 
                    key={star}
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={16}
                    color={star <= rating ? '#a16207' : '#d3d3d3'}
                />
            ))}
        </View>
    )
}

const Coursedetail = () => {
    const { courseId } = useLocalSearchParams<{ courseId: string }>()
    const [selectedSegment, setSelectedSegment] = useState<'curriculum' | 'reviews'>('curriculum')
    const [curriculumPage, setCurriculumPage] = useState<number>(1)
    const queryClient = useQueryClient()
    //Course Details
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['courseId', courseId],
        queryFn: () => fetchCourseDetail(courseId || ''),
        enabled: true,
    })
    //Curriculum data
    const {  
        data: curriculumData, 
        error: curriculumError, 
        isLoading: curriculumIsLoading, 
        isFetching: curriculumRefetch,
    } = useQuery<CurriculumData>({
        queryKey: ['coursecurriculum', courseId, curriculumPage],
        queryFn: () => fetchCourseCarriculum(courseId || '', curriculumPage),
        enabled: !!courseId,
        
    })
    //Reviews
    const {  
        data: reviewsData, 
        error: reviewsError, 
        isLoading: reviewsIsLoading, 
    } = useQuery({
        queryKey: ['coursereviews', courseId],
        queryFn: () => fetchCourseReviews(courseId || ''),
        enabled: !!courseId,
        
    })

    const mergedCurriculumData = React.useMemo(() => {
        if (!curriculumData) return undefined

        const prevData = queryClient.getQueryData<typeof curriculumData>([
            'coursecurriculum',
            courseId,
            curriculumPage - 1,
        ])

        return {
            ...curriculumData,
            results: [...(prevData?.results || []), ...curriculumData.results],
        }
    }, [curriculumData, courseId, curriculumPage, queryClient])

    const loadMoreCurriculum = () => {
        if (curriculumData?.next) {
           setCurriculumPage((prev) => prev + 1) 
        }
    }

    const renderReviewsItem: ListRenderItem<Review> = ({item}) => {
        return (
            <View key={item.id} className='mb-4 border-t border-neutral-300 rounded-lg'>
                <View className='flex-row justify-between items-center mb-2'>
                    <Text className='text-lg font-bold'>{item.user?.display_name}</Text>
                    <StarRating rating={item.rating} />
                </View>

                <Text
                    className='text-gray-500 text-sm'
                    style={{fontFamily: "BarlowMedium"}}
                >
                    {new Date(item.created).toLocaleDateString()}
                </Text>
                {item.content ? (
                    <Text 
                        className='text-gray-600 mt-2 capitalize'
                        style={{fontFamily: "BarlowBold"}}
                    >
                        {item.content}
                    </Text>
                ) : (
                    <Text className='text-gray-600 mt-2'>No comments provided</Text>
                )}
            </View>
        )
    }

    if (isLoading || reviewsIsLoading || (curriculumIsLoading && curriculumPage === 1)) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size='large' color='#000' />
            </View>
        )
    }

    if (error || reviewsError || curriculumError) {
        return (
            <View className='flex-1 justify-center items-center'>
                <Text>Error fetching data: {((error || reviewsError || curriculumError) as Error).message}</Text>
            </View>
        )
    }

    if (!data) {
        return (
            <View className='flex-1 justify-center items-center'>
                <Text className='text-2xl' style={{ fontFamily: 'BarlowBold' }}>
                    No course found with id: {courseId}
                </Text>
            </View>
        )
    }

  return (
    <ParallaxScrollView
        headerBackgroundColor={{light: "#D0D0D0", dark: "#353636"}}
        headerImage={
            <Image 
                source={{
                    uri: data?.image_480x270,
                }}
                className='w-full h-72 rounded-lg'
            />
        }
    >
        <View>
            <View className='bg-blue-700 rounded-xl p-0.5 mb-4 w-32 justify-center items-center'>
                <Text
                    className='text-base text-white'
                    style={{fontFamily: "BarlowMedium"}}
                >
                    {data?.locale.title}
                </Text>
            </View>

            <Text className='text-2xl' style={{fontFamily: "BarlowBold"}}>
                {data?.title}
            </Text>

            <View>
                <Text
                    className='text-base text-gray-700'
                    style={{fontFamily: "BarlowMedium"}}
                >
                    {data?.visible_instructors[0].display_name}
                </Text>
            </View>

            <Text className='text-3xl mt-6' style={{fontFamily: "BarlowBold"}}>
                {data?.is_paid ? data.price : 'Free'}
            </Text>

            <SegmentedControl 
                selectedSegment={selectedSegment}
                onSegmentChange={setSelectedSegment}
            />

            {selectedSegment === 'curriculum' ? (
                <>
                    <CurriculumList 
                        curriculumData={mergedCurriculumData}
                        isLoading={curriculumIsLoading}
                        onLoadMore={loadMoreCurriculum}
                    />
                </>
            ) : (
                <>
                    <Text
                        className='text-2xl pb-4'
                        style={{
                            fontFamily: 'BarlowBold'
                        }}
                    >
                        Reviews
                    </Text>
                    <FlatList 
                        nestedScrollEnabled={true}
                        scrollEnabled={false}
                        data={reviewsData?.results}
                        renderItem={renderReviewsItem}
                        keyExtractor={item => item.id.toString()}
                    />
                </>
            )}
        </View>
    </ParallaxScrollView>
  )
}

export default Coursedetail