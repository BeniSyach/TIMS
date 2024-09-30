/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { useAuth, useIsFirstTime } from '@/core';
import { EyeIcon, Home, UserCircle, UserGroup, Users as UsersMenu } from '@/ui/icons';

export default function TabLayout() {
  const status = useAuth.use.status();
  const token = useAuth.use.token();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          // headerLeft: () => <CreateNewPostLink/>,
          tabBarIcon: ({ color }) => <Home color={color} />,
          // headerRight: () => <CreateNewPostLink />,
          tabBarTestID: 'home-tab',
        }}
      /> 

        {token?.role === 'Timses' ? (
          <Tabs.Screen
            name="pendukung"
            options={{
              title: 'Pendukung',
              headerShown: false,
              tabBarIcon: ({ color }) => <UsersMenu color={color} />,
              tabBarTestID: 'pendukung-tab',
            }}
          />
        ) : (
          <Tabs.Screen
          name="pendukung"
          options={{
            href: null,
          }}
        />
        )}  

        {token?.role === 'Timses' ? (
        <Tabs.Screen
          name="timses-home"
          options={{
            title: 'Timses',
            headerShown: false,
            tabBarIcon: ({ color }) => <UserGroup color={color} />,
            tabBarTestID: 'timses-tab',
          }}
        />
      ) : (
        <Tabs.Screen
        name="timses-home"
        options={{
          href: null,
        }}
      />
      )} 

       {token?.role === 'Saksi' ? (
          <Tabs.Screen
            name="saksi"
            options={{
              title: 'Saksi',
              headerShown: false,
              tabBarIcon: ({ color }) => <EyeIcon color={color} />,
              tabBarTestID: 'profile-tab',
            }}
          />
      ) : (
        <Tabs.Screen
        name="saksi"
        options={{
          href: null,
        }}
      />
      )} 

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <UserCircle color={color} />,
          tabBarTestID: 'profile-tab',
        }}
      />
    </Tabs>
  );
}
