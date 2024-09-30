import { View, Text, FlatList } from 'react-native'
import React, { useRef } from 'react'
import { useWishlistStore } from '@/store/wishlistStore'
import CourseItemTertiary from '@/components/CourseItemTertiary'
import Animated, { FadeInDown } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'


const Wishlist = () => {
    // Your wishlist component goes here
    const { wishlist } = useWishlistStore()
    const animation = useRef<LottieView>(null)
  return (
    <View className='flex-1 pt-12 bg-white'>
        <View className='p-4'>
            <Text
                className='text-2xl font-bold mb-4'
                style={{ fontFamily: 'BarlowBold' }}
            >
                My Wishlist
            </Text>

            {wishlist.length === 0 ? (
                <View className='justify-center items-center w-full'>
                    <Animated.View
                        className='w-full'
                        entering={FadeInDown.duration(300).springify()}
                    >
                        <Text
                            className='text-xl font-semibold text-center'
                            style={{ fontFamily: 'BarlowSemiBold' }}
                        >
                            No items in your wishlist.
                        </Text>
                    </Animated.View>

                    <Animated.View 
                        className='w-full'
                        entering={FadeInDown.duration(300).delay(300).springify()}
                    >
                        <LottieView
                            ref={animation} 
                            source={require('@/assets/animation/Learner1.json')}
                            autoPlay
                            loop
                            style={{ width: '100%', height: 400 }}
                        />
                    </Animated.View>
                </View>
            ) : (
                <FlatList 
                    data={wishlist}
                    renderItem={({ item, index }) => (
                        <CourseItemTertiary course={item} index={index} />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    </View>
  )
}

export default Wishlist