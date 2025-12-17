import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ExternalLink, Copy, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Proposal {
  id: string;
  share_id: string;
  title: string;
  created_at: string;
  expires_at: string | null;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
        navigate('/');
      }
    }
  }, [user, isAdmin, loading, navigate, toast]);

  const fetchProposals = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('shared_proposals')
      .select('id, share_id, title, created_at, expires_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching proposals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load proposals.',
        variant: 'destructive',
      });
    } else {
      setProposals(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProposals();
    }
  }, [isAdmin]);

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a proposal title.',
        variant: 'destructive',
      });
      return;
    }

    // Navigate to main proposal editor with title
    setIsCreateOpen(false);
    navigate('/', { state: { newProposal: true, title: newTitle.trim() } });
    setNewTitle('');
  };

  const handleEdit = async () => {
    if (!editingProposal || !editTitle.trim()) return;

    const { error } = await supabase
      .from('shared_proposals')
      .update({ title: editTitle.trim() })
      .eq('id', editingProposal.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update proposal.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Proposal updated successfully.',
      });
      fetchProposals();
      setIsEditOpen(false);
      setEditingProposal(null);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('shared_proposals')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete proposal.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Proposal deleted successfully.',
      });
      fetchProposals();
    }
  };

  const copyLink = (shareId: string) => {
    const url = `${window.location.origin}/view/${shareId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied',
      description: 'Public link copied to clipboard.',
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your proposals</p>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link to="/">View Proposal Editor</Link>
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Proposals</CardTitle>
              <CardDescription>All saved proposals with shareable links</CardDescription>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Proposal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Proposal</DialogTitle>
                  <DialogDescription>Enter a title for your new proposal.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Proposal Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Q1 Healthcare Proposal"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate}>Create & Edit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {proposals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No proposals yet. Create your first one!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">{proposal.title || 'Untitled'}</TableCell>
                      <TableCell>{new Date(proposal.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {proposal.expires_at 
                          ? new Date(proposal.expires_at).toLocaleDateString()
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyLink(proposal.share_id)}
                            title="Copy public link"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            title="View proposal"
                          >
                            <a href={`/view/${proposal.share_id}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingProposal(proposal);
                              setEditTitle(proposal.title || '');
                              setIsEditOpen(true);
                            }}
                            title="Edit title"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" title="Delete proposal">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Proposal</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{proposal.title || 'Untitled'}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(proposal.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Proposal</DialogTitle>
              <DialogDescription>Update the proposal title.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Proposal Title</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
