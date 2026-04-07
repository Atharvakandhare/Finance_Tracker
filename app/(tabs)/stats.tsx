import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Colors } from '../../utils/theme';
import MoneyFlowChart from '../../components/MoneyFlowChart';
import GlassCard from '../../components/GlassCard';
import { TrendingUp, TrendingDown, Target } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const isDarkMode = useFinanceStore((state) => state.isDarkMode);
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const currency = useFinanceStore((state) => state.currency);
  const budget = useFinanceStore((state) => state.monthlyBudget);
  const totalExpense = useFinanceStore((state) => state.getTotalExpenses());
  const budgetUsage = Math.min((totalExpense / budget) * 100, 100);
  const transactions = useFinanceStore((state) => state.transactions);

  // Group transactions by category for breakdown
  const categoryData = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categories: Record<string, number> = {};
    
    expenseTransactions.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    return Object.entries(categories)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 categories
  }, [transactions]);

  const CategoryProgress = ({ name, amount, total }: any) => {
    const percentage = Math.min((amount / total) * 100, 100);
    return (
      <View style={styles.categoryItem}>
        <View style={styles.categoryInfo}>
          <Text style={[styles.categoryName, { color: theme.text }]}>{name}</Text>
          <Text style={[styles.categoryAmount, { color: theme.textSecondary }]}>{currency}{amount.toLocaleString()}</Text>
        </View>
        <View style={[styles.categoryBarBg, { backgroundColor: theme.border + '30' }]}>
          <View style={[styles.categoryBarFill, { width: `${percentage}%`, backgroundColor: theme.primary }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: Math.max(insets.bottom, 20) + 100 }
        ]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
            <View>
                <Text style={[styles.title, { color: theme.text }]}>Analytics</Text>
                <Text style={[styles.dateRange, { color: theme.textSecondary }]}>April 2026</Text>
            </View>
        </View>

        {/* Money Flow Chart (Weekly/Monthly) */}
        <MoneyFlowChart />

        {/* Spending by Category (NEW) */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Category Breakdown</Text>
        <GlassCard intensity={25} style={styles.categoryCard}>
            {categoryData.length > 0 ? (
                categoryData.map((item, index) => (
                    <CategoryProgress 
                        key={item.name} 
                        name={item.name} 
                        amount={item.amount} 
                        total={totalExpense || 1} 
                    />
                ))
            ) : (
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No expenses tracked yet.</Text>
            )}
        </GlassCard>

        {/* Budget Status */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Budget Progress</Text>
        <GlassCard intensity={30} style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <View style={styles.budgetTitleRow}>
              <View style={[styles.targetIcon, { backgroundColor: theme.accentBlue + '20' }]}>
                <Target size={20} color={theme.accentBlue} />
              </View>
              <Text style={[styles.budgetTitle, { color: theme.text }]}>Monthly Budget</Text>
            </View>
            <Text style={[styles.budgetText, { color: theme.textSecondary }]}>
              {currency}{totalExpense.toLocaleString()} / {currency}{budget.toLocaleString()}
            </Text>
          </View>
          
          <View style={[styles.progressBg, { backgroundColor: theme.border + '50' }]}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${budgetUsage}%`, backgroundColor: budgetUsage > 80 ? theme.error : theme.secondary }
              ]} 
            />
          </View>
          <Text style={[styles.budgetLabel, { color: theme.textSecondary, marginTop: 12 }]}>
            You've spent {budgetUsage.toFixed(0)}% of your monthly limit.
          </Text>
        </GlassCard>

        {/* Spending Insights (Bonus Feature) */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Smart Insights</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.insightsScroll}>
          <GlassCard intensity={40} style={styles.insightCard}>
            <TrendingDown size={24} color={theme.success} />
            <Text style={[styles.insightTitle, { color: theme.text }]}>Saving Trend</Text>
            <Text style={[styles.insightDesc, { color: theme.textSecondary }]}>You spent 12% less on Food compared to last week.</Text>
          </GlassCard>

          <GlassCard intensity={40} style={styles.insightCard}>
            <TrendingUp size={24} color={theme.primary} />
            <Text style={[styles.insightTitle, { color: theme.text }]}>Bill Alert</Text>
            <Text style={[styles.insightDesc, { color: theme.textSecondary }]}>Your utility bills are 5% higher this month.</Text>
          </GlassCard>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dateRange: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  categoryCard: {
    padding: 20,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  categoryBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetCard: {
    padding: 20,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  budgetText: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBg: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  budgetLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  insightsScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  insightCard: {
    width: 220,
    padding: 20,
    marginRight: 16,
    marginVertical: 8,
    marginLeft: 4,
    borderRadius: 24,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
    letterSpacing: -0.5,
  },
  insightDesc: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 10,
  }
});
