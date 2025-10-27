import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus, Trash2 } from 'lucide-react';
import { AllowedEmail } from '@/types/logistics';

interface AdminPanelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminPanelDialog({ open, onOpenChange }: AdminPanelDialogProps) {
  const [allowedEmails, setAllowedEmails] = useState<AllowedEmail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchAllowedEmails();
    }
  }, [open]);

  const fetchAllowedEmails = async () => {
    try {
      const { data, error } = await supabase
        .from('allowed_emails')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setAllowedEmails(data || []);
    } catch (error: any) {
      toast.error('Error loading users: ' + error.message);
    }
  };

  const handleAddEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as 'admin' | 'logistics' | 'cadet';

    try {
      const { error } = await supabase
        .from('allowed_emails')
        .insert({ email, name, role });

      if (error) throw error;

      toast.success('User added successfully!');
      e.currentTarget.reset();
      fetchAllowedEmails();
    } catch (error: any) {
      toast.error('Error adding user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEmail = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from authorized users?`)) return;

    try {
      const { error } = await supabase
        .from('allowed_emails')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('User removed successfully!');
      fetchAllowedEmails();
    } catch (error: any) {
      toast.error('Error removing user: ' + error.message);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Admin (Instructor)',
      logistics: 'Logistics Officer',
      cadet: 'Cadet User'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-destructive/10 text-destructive',
      logistics: 'bg-primary/10 text-primary',
      cadet: 'bg-muted text-muted-foreground'
    };
    return colors[role as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Panel - Manage Access</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-accent/50 border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">Add New User</h3>
            <form onSubmit={handleAddEmail} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  className="h-10"
                />
              </div>
              <div>
                <Input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  required
                  className="h-10"
                />
              </div>
              <div>
                <Select name="role" required defaultValue="cadet">
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cadet">Cadet</SelectItem>
                    <SelectItem value="logistics">Logistics Officer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-10"
              >
                <UserPlus size={18} className="mr-2" />
                Add
              </Button>
            </form>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Authorized Users</h3>
            <div className="space-y-2">
              {allowedEmails.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-accent/30 rounded-lg border border-border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEmail(user.id, user.name)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
