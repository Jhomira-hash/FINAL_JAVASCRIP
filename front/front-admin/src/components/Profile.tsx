import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Loader2 } from 'lucide-react';
import { getProfile, updateProfile, changePassword } from '../services/api';
import { toast } from 'sonner@2.0.3';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    phone: '',
    createdAt: '',
    lastLogin: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      toast.error('Error al cargar perfil: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const profileData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
    };

    try {
      const updated = await updateProfile(profileData);
      setProfile({ ...profile, ...updated });
      setIsEditing(false);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('current-password') as string;
    const newPassword = formData.get('new-password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      setIsSaving(false);
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      toast.success('Contraseña actualizada correctamente');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Error al cambiar contraseña: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-gray-900">Mi Perfil</h2>
        <p className="text-gray-500">Información de tu cuenta</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
              <Badge variant="outline" className="mt-2">{profile.role}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          
          {!isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Nombre Completo</p>
                  <p className="text-gray-900">{profile.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Correo Electrónico</p>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Teléfono</p>
                  <p className="text-gray-900">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Rol</p>
                  <p className="text-gray-900">{profile.role}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Fecha de Registro</p>
                  <p className="text-gray-900">{profile.createdAt}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Último Acceso</p>
                  <p className="text-gray-900">{profile.lastLogin}</p>
                </div>
              </div>
              
              <Separator />
              
              <Button onClick={() => setIsEditing(true)}>
                Editar Información
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={profile.name}
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={profile.email}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={profile.phone}
                    disabled={isSaving}
                    required
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
          <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <Input
                id="current-password"
                name="current-password"
                type="password"
                placeholder="••••••••"
                disabled={isSaving}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input
                id="new-password"
                name="new-password"
                type="password"
                placeholder="••••••••"
                disabled={isSaving}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="••••••••"
                disabled={isSaving}
                required
              />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar Contraseña'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
