import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Colors } from '../../utils/theme';
import GlassCard from '../../components/GlassCard';
import CategoryIcon from '../../components/CategoryIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingBag, ShoppingCart, Car, Utensils, Zap, Play, Wallet, MoreHorizontal, Search, Bell, Plus, Cpu, Wifi } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDarkMode = useFinanceStore((state) => state.isDarkMode);
  const transactions = useFinanceStore((state) => state.transactions);
  const currency = useFinanceStore((state) => state.currency);
  const balance = useFinanceStore((state) => state.getTotalBalance());
  const [showBalance, setShowBalance] = React.useState(false);
  
  const monthlyIncome = useFinanceStore((state) => state.getMonthlyIncome());
  const monthlyExpenses = useFinanceStore((state) => state.getMonthlyExpenses());
  
  const theme = isDarkMode ? Colors.dark : Colors.light;

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
          <View style={styles.brandRow}>
            <Image 
              source={require('../../assets/Sentinel_logo.png')} 
              style={styles.brandLogo}
            />
            <View>
              <Text style={[styles.greeting, { color: theme.textSecondary }]}>Sentinel</Text>
              <Text style={[styles.welcome, { color: theme.text }]}>Dashboard</Text>
            </View>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.card }]}>
              <Search size={22} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.card }]}>
              <Bell size={22} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.balanceCardContainer, { shadowColor: theme.shadow }]}>
          <LinearGradient
            colors={isDarkMode ? ['#FF6B35', '#4D96FF', '#7D5FFF'] : ['#4158D0', '#C850C0', '#FFCC70']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={[styles.cardTitle, { color: '#FFF' }]}>Total Balance</Text>
              </View>
              <View style={styles.chipContainer}>
                <View style={styles.chipInner}>
                  <Cpu size={24} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
                </View>
              </View>
            </View>

            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setShowBalance(!showBalance)}
              style={styles.balanceDisplayContainer}
            >
                <Text style={[styles.balanceAmount, { color: '#FFF' }]}>
                  {showBalance ? `${currency}${balance.toLocaleString('en-IN')}` : `${currency} • • • • •`}
                </Text>
                <Wifi size={20} color="rgba(255,255,255,0.4)" style={styles.nfcIcon} />
            </TouchableOpacity>

            <View style={[styles.cardInfoPlate, { backgroundColor: 'rgba(255, 255, 255, 0.12)' }]}>
              <View style={styles.cardBottom}>
                <Text style={[styles.cardNumber, { color: '#FFF' }]}>**** **** **** 3456</Text>
                <Text style={[styles.cardHolder, { color: '#FFF' }]}>Sentinel Elite</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Insights (PayU Style) */}
        <View style={styles.insightsRow}>
          <GlassCard style={styles.insightBox}>
            <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>Income</Text>
            <Text style={[styles.insightValue, { color: theme.success }]}>+{currency}{monthlyIncome.toLocaleString('en-IN')}</Text>
          </GlassCard>
          <GlassCard style={styles.insightBox}>
            <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>Outcome</Text>
            <Text style={[styles.insightValue, { color: theme.error }]}>-{currency}{monthlyExpenses.toLocaleString('en-IN')}</Text>
          </GlassCard>
        </View>

        {/* Transactions List */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAll, { color: theme.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No transactions yet. Tap '+' to start tracking.</Text>
          </View>
        ) : (
          transactions.slice(0, 5).map((item) => (
            <TouchableOpacity key={item.id} style={[styles.transactionItem, { backgroundColor: theme.card }]}>
              <View style={styles.transactionLeft}>
                <CategoryIcon category={item.category} type={item.type} />
                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionName, { color: theme.text }]}>{item.category}</Text>
                  <Text style={[styles.transactionNote, { color: theme.textSecondary }]}>{item.note || 'No note'}</Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount, 
                { color: item.type === 'income' ? theme.success : theme.text }
              ]}>
                {item.type === 'income' ? '+' : '-'}{currency}{item.amount}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[
          styles.fab, 
          { 
            backgroundColor: theme.primary,
            bottom: Math.max(insets.bottom, 20) + 84 
          }
        ]}
        onPress={() => router.push('/add-transaction')}>
        <Plus size={32} color="#FFF" />
      </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 32,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
  },
  greeting: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  balanceCardContainer: {
    height: 220,
    marginBottom: 24,
    borderRadius: 28,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 8,
  },
  balanceCard: {
    flex: 1,
    borderRadius: 28,
    padding: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eyeToggle: {
    paddingVertical: 4,
    marginTop: 2,
  },
  chipContainer: {
    width: 50,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    padding: 2,
  },
  chipInner: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  nfcIcon: {
    transform: [{ rotate: '90deg' }],
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  cardInfoPlate: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    fontSize: 15,
    letterSpacing: 2,
    fontWeight: '600',
    opacity: 0.9,
  },
  cardHolder: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  insightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  insightBox: {
    flex: 0.48,
    padding: 16,
  },
  insightLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionInfo: {
    marginLeft: 16,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionNote: {
    fontSize: 14,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  }
});
