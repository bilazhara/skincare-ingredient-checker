import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAF7',
  },

  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },

  cardContainer: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  title: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 16,
    textAlign: 'left',
  },

  subtitle: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'left',
  },

  searchBox: {
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    marginBottom: 20,
    backgroundColor: '#FBFCFB',
  },

  searchInput: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    color: '#1B5E20',
  },

  selectedSection: {
    marginBottom: 20,
    gap: 6,
    padding: 10,
    backgroundColor: '#F1F8F1',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },

  selectedText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    color: '#2E7D32',
  },

  boldText: {
    fontWeight: '700',
    color: '#1B5E20',
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },

  tag: {
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },

  tagSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20',
  },

  tagText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },

  tagTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },

  checkButton: {
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    marginBottom: 8,
  },

  checkButtonDisabled: {
    borderColor: '#C8E6C9',
    backgroundColor: '#F9FBF9',
  },

  checkButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
    letterSpacing: 1.2,
  },

  checkButtonTextDisabled: {
    color: '#A5D6A7',
  },

  resultCard: {
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    borderLeftWidth: 8,
    borderRadius: 6,
    padding: 16,
    marginTop: 8,
  },

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  resultIcon: {
    fontSize: 18,
  },

  resultLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  resultIngredients: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
  },

  resultNote: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
});

export default styles;