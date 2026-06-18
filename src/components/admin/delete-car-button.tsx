// T-013
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

type DeleteCarButtonProps = {
  carId: string;
  carTitle: string;
};

export function DeleteCarButton({ carId, carTitle }: DeleteCarButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    try {
      await api.del(`/admin/cars/${carId}`);
      setDialogOpen(false);
      showToast({ variant: 'success', message: 'Fahrzeug wurde erfolgreich gelöscht.' });
      router.refresh();
    } catch {
      showToast({ variant: 'error', message: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        aria-label={`${carTitle} löschen`}
        className="ml-3 text-danger transition-colors hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>

      <ConfirmDialog
        isOpen={dialogOpen}
        title="Fahrzeug löschen"
        message="Möchten Sie dieses Fahrzeug wirklich löschen? Alle Bilder und Angebote werden unwiderruflich entfernt."
        confirmLabel="Löschen"
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
        isLoading={deleting}
        danger
      />
    </>
  );
}
