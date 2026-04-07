import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, Platform } from 'react-native';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Colors } from '../../utils/theme';
import { Moon, Sun, Bell, Shield, HelpCircle, LogOut, ChevronRight, User, Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme, monthlyBudget, getMonthlyExpenses, getTotalIncome, getTotalExpenses, getTotalBalance } = useFinanceStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const monthlyExpenses = getMonthlyExpenses();
  const totalIncome = getTotalIncome();
  const totalBalance = getTotalBalance();
  const percentUsed = Math.min(Math.round((monthlyExpenses / monthlyBudget) * 100), 100);

  const SettingItem = ({ icon: Icon, label, value, onPress, isSwitch }: any) => (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: theme.card }]}
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.border + '50' }]}>
          <Icon size={20} color={theme.text} />
        </View>
        <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
      </View>
      {isSwitch ? (
        <Switch 
          value={isDarkMode} 
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor={Platform.OS === 'ios' ? '#FFF' : theme.text}
        />
      ) : (
        <View style={styles.settingRight}>
          {value && <Text style={[styles.settingValue, { color: theme.textSecondary }]}>{value}</Text>}
          <ChevronRight size={20} color={theme.textSecondary} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: Math.max(insets.bottom, 20) + 100 }
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>

        {/* Redesigned User Card */}
        <GlassCard intensity={40} style={styles.userCard}>
          <LinearGradient
            colors={isDarkMode ? ['rgba(255, 107, 53, 0.15)', 'transparent'] : ['rgba(255, 107, 53, 0.05)', 'transparent']}
            style={styles.cardGradient}
          />
          
          <View style={styles.userHeader}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatarGlow, { backgroundColor: theme.primary + '30' }]} />
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <User size={32} color="#FFF" />
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>Alex Johnson</Text>
              <Text style={[styles.userEmail, { color: theme.textSecondary }]}>alex.j@sentinel.io</Text>
              <View style={[styles.badge, { backgroundColor: theme.secondary + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.secondary }]}>SENTINEL ELITE</Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border + '50' }]} />

          <View style={styles.balanceSection}>
            <View>
              <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Total Balance</Text>
              <Text style={[styles.balanceAmount, { color: theme.text }]}>₹{totalBalance.toLocaleString()}</Text>
            </View>
            <View style={[styles.walletIcon, { backgroundColor: theme.primary + '15' }]}>
              <Wallet size={20} color={theme.primary} />
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: theme.secondary + '10' }]}>
              <View style={styles.statHeader}>
                <TrendingUp size={16} color={theme.secondary} />
                <Text style={[styles.statTitle, { color: theme.textSecondary }]}>Income</Text>
              </View>
              <Text style={[styles.statValue, { color: theme.secondary }]}>₹{(totalIncome / 1000).toFixed(1)}k</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.primary + '10' }]}>
              <View style={styles.statHeader}>
                <TrendingDown size={16} color={theme.primary} />
                <Text style={[styles.statTitle, { color: theme.textSecondary }]}>Outcome</Text>
              </View>
              <Text style={[styles.statValue, { color: theme.primary }]}>₹{(monthlyExpenses / 1000).toFixed(1)}k</Text>
            </View>
          </View>

          {/* Monthly Budget Progress Bar */}
          <View style={styles.budgetSection}>
            <View style={styles.budgetHeader}>
              <View style={styles.budgetTitleRow}>
                <Target size={16} color={theme.accentBlue} />
                <Text style={[styles.budgetLabel, { color: theme.text }]}>Monthly Budget</Text>
              </View>
              <Text style={[styles.budgetPercent, { color: theme.accentBlue }]}>{percentUsed}% Used</Text>
            </View>
            <View style={[styles.progressBarContainer, { backgroundColor: theme.border + '50' }]}>
              <LinearGradient
                colors={[theme.accentBlue, theme.accentPink]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBar, { width: `${percentUsed}%` }]}
              />
            </View>
            <View style={styles.budgetFooter}>
              <Text style={[styles.budgetSpent, { color: theme.textSecondary }]}>₹{monthlyExpenses.toLocaleString()} spent</Text>
              <Text style={[styles.budgetTotal, { color: theme.textSecondary }]}>of ₹{monthlyBudget.toLocaleString()}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Settings Groups */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>General</Text>
        <SettingItem 
          icon={isDarkMode ? Moon : Sun} 
          label="Dark Mode" 
          isSwitch 
        />
        <SettingItem icon={Bell} label="Notifications" value="On" />
        <SettingItem icon={Shield} label="Security" value="Fingerprint" />

        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Support</Text>
        <SettingItem icon={HelpCircle} label="Help Center" />
        
        <TouchableOpacity style={styles.logoutBtn}>
          <LogOut size={20} color={theme.error} />
          <Text style={[styles.logoutText, { color: theme.error }]}>Log Out</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
  },
  userCard: {
    padding: 20,
    marginBottom: 32,
    overflow: 'hidden',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 36,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  balanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  walletIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  budgetSection: {
    marginTop: 8,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  budgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  budgetPercent: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 10,
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetSpent: {
    fontSize: 12,
    fontWeight: '500',
  },
  budgetTotal: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    marginLeft: 4,
  },
  settingItem: {
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
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    marginRight: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  }
});
