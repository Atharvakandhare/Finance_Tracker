import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Colors, Typography } from '../utils/theme';
import { useFinanceStore, Transaction } from '../store/useFinanceStore';
import GlassCard from './GlassCard';

type ViewType = 'weekly' | 'monthly';

const MoneyFlowChart = () => {
  const [view, setView] = useState<ViewType>('weekly');
  const isDarkMode = useFinanceStore((state) => state.isDarkMode);
  const transactions = useFinanceStore((state) => state.transactions);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const chartData = useMemo(() => {
    const data: any[] = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const labels = view === 'weekly' ? days : months;
    
    labels.forEach((label) => {
      // Mock data logic for visualization
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (Math.random() * 5000), 0);
      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (Math.random() * 4000), 0);
        
      // Income Bar
      data.push({
        value: totalIncome || 1,
        label: label,
        frontColor: theme.secondary,
        spacing: 4, // Small space between bars in same group
        labelTextStyle: { color: theme.textSecondary, fontSize: 10 },
      });
      // Expense Bar
      data.push({
        value: totalExpense || 1,
        frontColor: theme.primary,
        spacing: 20, // Larger space between groups
      });
    });

    return data;
  }, [view, transactions, theme]);

  return (
    <GlassCard intensity={40} style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Money Flow</Text>
        <View style={[styles.segmentedControl, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <TouchableOpacity 
            onPress={() => setView('weekly')}
            style={[styles.segmentBtn, view === 'weekly' && { backgroundColor: theme.text, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }]}>
            <Text style={[styles.segmentText, { color: view === 'weekly' ? theme.background : theme.textSecondary }]}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setView('monthly')}
            style={[styles.segmentBtn, view === 'monthly' && { backgroundColor: theme.text, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }]}>
            <Text style={[styles.segmentText, { color: view === 'monthly' ? theme.background : theme.textSecondary }]}>Monthly</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chart}>
        <BarChart
          data={chartData}
          width={Dimensions.get('window').width - 100}
          height={180}
          barWidth={12}
          roundedTop
          hideRules
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
          noOfSections={3}
          maxValue={15000}
          isAnimated
        />
      </View>

      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: theme.primary }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Outcome</Text>
        </View>
      </View>
    </GlassCard>
  );
};

import { Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  chart: {
    alignItems: 'center',
    marginLeft: -10,
    marginTop: 10,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    minWidth: 140,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  }
});

export default MoneyFlowChart;
