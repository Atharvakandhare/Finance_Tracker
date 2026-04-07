import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Home, PieChart, User, Target } from 'lucide-react-native';
import { Colors } from '../utils/theme';
import { useFinanceStore } from '../store/useFinanceStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const isDarkMode = useFinanceStore((state) => state.isDarkMode);
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.tabBarContainer, 
      { 
        bottom: Math.max(insets.bottom, 20),
        backgroundColor: theme.tabBar,
        shadowColor: theme.shadow,
      }
    ]}>
      {Platform.OS === 'ios' && (
        <BlurView
          tint={isDarkMode ? 'dark' : 'light'}
          intensity={80}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.content}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const renderIcon = (color: string) => {
            switch (route.name) {
              case 'index':
                return <Home size={26} color={color} />;
              case 'stats':
                return <PieChart size={26} color={color} />;
              case 'budget':
                return <Target size={26} color={color} />;
              case 'profile':
                return <User size={26} color={color} />;
              default:
                return null;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <View style={styles.iconWrapper}>
                {renderIcon(isFocused ? theme.primary : theme.textSecondary)}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    elevation: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  }
});

export default CustomTabBar;
