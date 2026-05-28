// ProposalPDF — renders the proposal document for download/email
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { Service } from '@/data/servicesData';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  header: { marginBottom: 30, borderBottom: '2 solid #333', paddingBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 12, color: '#666', marginBottom: 10 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 6, color: '#333' },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { width: 140, fontWeight: 'bold' },
  value: { flex: 1 },
  servicesTable: { marginTop: 10, marginBottom: 15 },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #ccc', paddingVertical: 5 },
  th: { width: 180, fontWeight: 'bold' },
  thPrice: { width: 100, textAlign: 'right', fontWeight: 'bold' },
  thTier: { width: 120, textAlign: 'right', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottom: '1 solid #eee', paddingVertical: 4 },
  td: { width: 180 },
  tdPrice: { width: 100, textAlign: 'right' },
  tdTier: { width: 120, textAlign: 'right', color: '#666' },
  totalRow: { flexDirection: 'row', marginTop: 10, paddingTop: 10, borderTop: '2 solid #333' },
  totalLabel: { width: 180, fontWeight: 'bold', fontSize: 13 },
  totalValue: { width: 100, textAlign: 'right', fontWeight: 'bold', fontSize: 13 },
  footer: { marginTop: 40, fontSize: 9, color: '#999', borderTop: '1 solid #eee', paddingTop: 10 },
  cta: { marginTop: 20, backgroundColor: '#004080', padding: 15, color: 'white' }
});

export default function ProposalPDF({ data }: { data: any }) {
  const { companyName, contactEmail, contactPhone, budget, needs, selectedServices, timeline, proposalId, generatedAt } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Zion Tech Group — Custom Proposal</Text>
          <Text style={styles.title}>Proposal ID: {proposalId} • Generated: {new Date(generatedAt).toLocaleDateString()}</Text>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.row}><Text style={styles.label}>Company:</Text><Text style={styles.value}>{companyName}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{contactEmail}</Text></View>
          {contactPhone && <View style={styles.row}><Text style={styles.label}>Phone:</Text><Text style={styles.value}>{contactPhone}</Text></View>}
          <View style={styles.row}><Text style={styles.label}>Budget Range:</Text><Text style={styles.value}>{budget}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Timeline:</Text><Text style={styles.value}>{timeline}</Text></View>
        </View>

        {/* Needs */}
        {needs?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stated Needs</Text>
            {needs.map((need: string, i: number) => (
              <View style={styles.row} key={i}><Text style={styles.label}>•</Text><Text style={styles.value}>{need}</Text></View>
            ))}
          </View>
        )}

        {/* Service Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Services</Text>
          <View style={[styles.tableHeader, { marginTop: 5 }]}>
            <Text style={styles.th}>Service</Text>
            <Text style={styles.thPrice}>Price</Text>
            <Text style={styles.thTier}>Tier</Text>
          </View>
          {selectedServices.map((svc: Service) => {
            const price = svc.pricing;
            const displayPrice = String(Object.values(price)[0]) || 'Contact for pricing';
            const tier = String(Object.keys(price)[0]) || 'Custom';
            return (
              <View style={styles.tableRow} key={svc.id}>
                <Text style={styles.td}>{svc.title}</Text>
                <Text style={styles.tdPrice}>{displayPrice}</Text>
                <Text style={styles.tdTier}>{tier}</Text>
              </View>
            );
          })}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated Total Investment</Text>
            <Text style={styles.totalValue}>Custom Quote</Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Ready to get started?</Text>
          <Text>Contact us at +1 302 464 0950 or kleber@ziontechgroup.com to activate your solution.</Text>
          <Text>364 E Main St STE 1008, Middletown DE 19709</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Zion Tech Group — All services include implementation support, SLA guarantees, and 24/7 monitoring. Pricing may vary based on usage volume and custom requirements.</Text>
        </View>
      </Page>
    </Document>
  );
}
