import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { useFinanceStore, TransactionType } from '../store/useFinanceStore';
import { Colors } from '../utils/theme';
import { useRouter } from 'expo-router';
import { X, Check, Utensils, ShoppingBag, Car, Receipt, Play, Wallet, MoreHorizontal } from 'lucide-react-native';
import GlassCard from '../components/GlassCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const CATEGORIES = [
  { id: 'food', icon: Utensils, label: 'Food', color: '#FF6B6B' },
  { id: 'shopping', icon: ShoppingBag, label: 'Shopping', color: '#4D96FF' },
  { id: 'transport', icon: Car, label: 'Travel', color: '#FFD93D' },
  { id: 'bills', icon: Receipt, label: 'Bills', color: '#6BCB77' },
  { id: 'entertainment', icon: Play, label: 'Fun', color: '#9D65C9' },
  { id: 'salary', icon: Wallet, label: 'Salary', color: '#4D96FF' },
  { id: 'other', icon: MoreHorizontal, label: 'Other', color: '#95A5A6' },
];

export default function AddTransactionScreen() {
  const router = useRouter();
  const isDarkMode = useFinanceStore((state) => state.isDarkMode);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const currency = useFinanceStore((state) => state.currency);
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!amount || isNaN(parseFloat(amount))) return;
    
    addTransaction({
      amount: parseFloat(amount),
      type,
      category,
      note,
      date: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={type === 'expense' 
          ? (isDarkMode ? ['#FF1E56', '#4D089A'] : ['#FF4B2B', '#FF416C']) 
          : (isDarkMode ? ['#00F2FE', '#4FACFE'] : ['#1DD1A1', '#00B09B'])
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1.5 }}
        style={[styles.heroSection, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <X size={26} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Entry</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.amountVisualArea}>
           <BlurView intensity={30} tint="light" style={styles.amountGlassPlate}>
              <Text style={styles.currencySymbol}>{currency}</Text>
              <TextInput
                style={styles.heroInput}
                placeholder="0"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="decimal-pad"
                autoFocus
                value={amount}
                onChangeText={setAmount}
                selectionColor="#FFF"
              />
           </BlurView>
        </View>

        {/* Premium Transparent Pill Toggle */}
        <View style={styles.toggleWrapper}>
          <View style={styles.transparentToggle}>
            <TouchableOpacity 
              onPress={() => setType('expense')}
              style={[styles.typeBtn, type === 'expense' && styles.activeExpenseBtn]}>
              <Text style={[styles.typeText, type === 'expense' ? styles.activeTypeText : { color: 'rgba(255,255,255,0.6)' }]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setType('income')}
              style={[styles.typeBtn, type === 'income' && styles.activeIncomeBtn]}>
              <Text style={[styles.typeText, type === 'income' ? styles.activeTypeText : { color: 'rgba(255,255,255,0.6)' }]}>Income</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Category Picker with Neon Glow */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Choose Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((item) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => setCategory(item.id)}
                style={styles.categoryWrap}
              >
                <View style={[
                  styles.categoryCircle, 
                  { backgroundColor: category === item.id ? item.color : theme.card },
                  category === item.id && {
                    shadowColor: item.color,
                    shadowOpacity: 0.6,
                    shadowRadius: 15,
                    elevation: 12,
                  }
                ]}>
                  <item.icon size={26} color={category === item.id ? '#FFF' : theme.textSecondary} />
                </View>
                <Text style={[
                  styles.categoryLabel, 
                  { color: category === item.id ? theme.text : theme.textSecondary, fontWeight: category === item.id ? '700' : '500' }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Details Section */}
          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 12 }]}>Execution Notes</Text>
          <GlassCard intensity={25} style={styles.noteBox}>
            <TextInput
              style={[styles.noteInput, { color: theme.text }]}
              placeholder="What was this for?"
              placeholderTextColor={theme.textSecondary + '70'}
              value={note}
              onChangeText={setNote}
              multiline
            />
          </GlassCard>

          <TouchableOpacity 
            onPress={handleSave} 
            style={[
              styles.neonFAB, 
              { backgroundColor: type === 'expense' ? '#FF1E56' : '#4FACFE' },
              { shadowColor: type === 'expense' ? '#FF1E56' : '#4FACFE' }
            ]}
          >
            <Text style={styles.confirmText}>Confirm Transaction</Text>
            <Check size={22} color="#FFF" />
          </TouchableOpacity>
          
          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountVisualArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  amountGlassPlate: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    overflow: 'hidden',
  },
  currencySymbol: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 32,
    fontWeight: '600',
    marginRight: 10,
    marginTop: 8,
  },
  heroInput: {
    color: '#FFF',
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -2,
    minWidth: 80,
  },
  toggleWrapper: {
    alignItems: 'center',
  },
  transparentToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 4,
    borderRadius: 22,
    width: '100%',
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  activeExpenseBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  activeIncomeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  typeText: {
    fontSize: 15,
    fontWeight: '800',
  },
  activeTypeText: {
    color: '#000',
  },
  scrollContent: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  categoryWrap: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryCircle: {
    width: 62,
    height: 62,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
  },
  noteBox: {
    borderRadius: 28,
    padding: 16,
    minHeight: 140,
    marginBottom: 36,
  },
  noteInput: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  neonFAB: {
    flexDirection: 'row',
    height: 64,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 15,
  },
  confirmText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  }
});
