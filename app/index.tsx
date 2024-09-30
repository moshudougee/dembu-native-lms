import { View, Text } from 'react-native'
import React, { useRef } from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Button from '@/components/Button'
import { router } from 'expo-router'
import LottieView from 'lottie-react-native'

const Welcome = () => {
    const animation = useRef<LottieView>(null)
  return (
    <View className='flex-1 justify-center items-center bg-white w-full gap-4 p-4'>

      <Animated.View 
        className='w-full'
        entering={FadeInDown.duration(300).springify()}
      >
        <LottieView
            ref={animation} 
            source={require('@/assets/animation/Learner2.json')}
            autoPlay
            loop
            style={{ width: '100%', height: 400 }}
        />
      </Animated.View>

      <Animated.View 
        className='w-full'
        entering={FadeInDown.duration(300).delay(200).springify()}
      >
        <Text 
            className='text-5xl text-center leading-[3.5rem]'
            style={{fontFamily: "BarlowExtraBold"}}
        >
            Discover and improve your skills
        </Text>
      </Animated.View>

      <Animated.View 
        className='w-full'
        entering={FadeInDown.duration(300).delay(400).springify()}
      >
        <Text 
            className='text-xl text-center leading-[2rem]'
            style={{fontFamily: "BarlowSemiBold"}}
        >
            Learn from the best courses and tutorials. 🚀🚀🎉
        </Text>
      </Animated.View>

      <Animated.View 
        className='w-full justify-center items-center'
        entering={FadeInDown.duration(300).delay(600).springify()}
      >
        <Button title='Get Started' action={() => router.push("/(tabs)")} />
      </Animated.View>
    </View>
  )
}

export default Welcome