import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { recentEvents } from "../../features/analytics/api";
import { getAnalytics } from "../../features/analytics/storage";

export default function AnalyticsDiag() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => { 
    loadData();
  }, []);

  const loadData = async () => {
    const events = await recentEvents(100);
    setData(events);
  };

  const clearData = async () => {
    await getAnalytics().resetAll();
    setData([]);
  };

  return (
    <SafeAreaView style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.h1}>Analytics (recent)</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearData}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.small}>{new Date(item.ts).toLocaleString()}</Text>
            <Text style={styles.small}>{JSON.stringify(item, null, 2)}</Text>
          </View>
        )}
        refreshing={false}
        onRefresh={loadData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { 
    flex: 1, 
    padding: 12,
    backgroundColor: '#171712',
  }, 
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  h1: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: '#ffffff',
  },
  clearButton: {
    backgroundColor: '#FF8A7A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  row: { 
    paddingVertical: 8, 
    borderBottomWidth: 1, 
    borderColor: "#333",
    marginBottom: 8,
  }, 
  type: { 
    fontWeight: "700",
    color: '#79E2D0',
    fontSize: 14,
  }, 
  small: { 
    color: "#bab29c", 
    fontSize: 12,
    marginTop: 4,
  }
}); 