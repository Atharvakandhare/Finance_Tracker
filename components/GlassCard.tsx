import React from 'react';
import { StyleSheet, View, ViewStyle, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../utils/theme';
import { useFinanceStore } from '../store/useFinanceStore';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

const { width } = Dimensions.get('window');

const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 60 }) => {
  const isDarkMode = useFinanceStore((state) => state.isDarkMode);
  const theme = isDarkMode ? Colors.dark : Colors.light;
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.card,
        shadowColor: theme.shadow,
        shadowOpacity: isDarkMode ? 0.3 : 0.08,
        elevation: isDarkMode ? 10 : 4,
      }, 
      style
    ]}>
      <BlurView
        intensity={intensity}
        tint={isDarkMode ? 'dark' : 'light'}
        style={styles.blur}
      >
        <View style={[
          styles.inner, 
          { 
            borderColor: theme.glassHighlight,
          }
        ]}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  blur: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 24,
    borderWidth: 1,
    borderRadius: 24,
  }
});

export default GlassCard;
