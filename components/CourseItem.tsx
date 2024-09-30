import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '@/types/types';
import { useWishlistStore } from '@/store/wishlistStore';
import { router } from 'expo-router';

interface CourseItemProps {
    course: Course;
    customStyle?: string;
    index: number;
}

const CourseItem: React.FC<CourseItemProps> = ({course, customStyle, index}) => {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()

    const isWishlisted = isInWishlist(course.id)

    const toggleWishlist = () => {
        isWishlisted? removeFromWishlist(course.id) : addToWishlist(course)
    }
  return (
    <Pressable 
        className={'pt-4' + customStyle ? customStyle : ''}
        onPress={() => 
            router.push({
                pathname: "/coursedetail",
                params: { courseId: course.id },
            })
        }
    >
        <Animated.View
            className='gap-2 w-full border border-gray-300 overflow-hidden rounded-2xl'
            entering={FadeInDown.duration(100).delay(index * 300).springify()}
        >
            <Image 
                source={{
                    uri: course.image_480x270,
                }}
                className='w-full h-40'
            />
            <View className='px-4 p-2'>
                <Text 
                    className='text-lg min-h-16'
                    style={{ fontFamily: "BarlowBold" }}
                >
                    {course.title}
                </Text>
                <View className='flex-row items-center pt-2 pb-4 justify-between'>
                    <Text>{course.is_paid ? `${course.price}` : 'Free'}</Text>
                    <Pressable onPress={toggleWishlist}>
                        <Ionicons
                            size={24} 
                            name={isWishlisted ? 'heart' : 'heart-outline'} 
                            color={isWishlisted ? 'red' : 'gray'} 
                        />
                    </Pressable>
                </View>
            </View>
        </Animated.View>
    </Pressable>
  )
}

export default CourseItem