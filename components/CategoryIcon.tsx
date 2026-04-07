import React from 'react';
import { StyleSheet, View } from 'react-native';
import { 
  Utensils, 
  ShoppingBag, 
  Car, 
  Receipt, 
  Play, 
  Wallet, 
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react-native';
import { Colors } from '../utils/theme';
import { useFinanceStore } from '../store/useFinanceStore';

interface CategoryIconProps {
  category: string;
  type?: 'income' | 'expense';
  size?: number;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, type, size = 24 }) => {
  const isDarkMode = useFinanceStore((state) => state.isDarkMode);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const getIcon = () => {
    switch (category.toLowerCase()) {
      case 'food': return <Utensils size={size} color={theme.text} />;
      case 'shopping': return <ShoppingBag size={size} color={theme.text} />;
      case 'transport': return <Car size={size} color={theme.text} />;
      case 'bills': return <Receipt size={size} color={theme.text} />;
      case 'entertainment': return <Play size={size} color={theme.text} />;
      case 'salary': return <Wallet size={size} color={theme.text} />;
      default: return <MoreHorizontal size={size} color={theme.text} />;
    }
  };

  const getBgColor = () => {
    if (type === 'income') return theme.secondary + '30';
    if (type === 'expense') return theme.primary + '30';
    return theme.border;
  };

  return (
    <View style={[styles.container, { backgroundColor: getBgColor() }]}>
      {getIcon()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CategoryIcon;
