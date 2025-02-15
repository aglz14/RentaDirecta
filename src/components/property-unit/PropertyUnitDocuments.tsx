import { Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const documents = [
  {
    id: '1',
    name: 'Contrato de Arrendamiento.pdf',
    type: 'PDF',
    uploadDate: '2025-02-15',
    expirationDate: '2026-02-15',
    size: '2.5 MB'
  },
  {
    id: '2',
    name: 'Inventario.pdf',
    type: 'PDF',
    uploadDate: '2025-02-15',
    expirationDate: null,
    size: '1.8 MB'
  }
];

export function PropertyUnitDocuments() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documentos</CardTitle>
        <Button className="bg-[#4CAF50] hover:bg-[#3d9140]">
          <Upload className="h-4 w-4 mr-2" />
          Subir Documento
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha de Carga</TableHead>
              <TableHead>Fecha de Vencimiento</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {doc.expirationDate 
                    ? new Date(doc.expirationDate).toLocaleDateString()
                    : 'No expira'}
                </TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}