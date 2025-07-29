import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Admin {
  id: string;
  nickname: string;
  level: string;
  steamId: string;
  discordId: string;
  lastActive: string;
  status: 'online' | 'offline' | 'vacation';
  warns: number;
  notes: string;
}

const mockAdmins: Admin[] = [
  {
    id: '1',
    nickname: 'SuperAdmin_RUS',
    level: 'Главный Администратор',
    steamId: 'STEAM_0:1:123456789',
    discordId: 'SuperAdmin#1234',
    lastActive: '2025-01-15 14:30',
    status: 'online',
    warns: 0,
    notes: 'Опытный администратор'
  },
  {
    id: '2',
    nickname: 'ModerPro',
    level: 'Старший Модератор',
    steamId: 'STEAM_0:0:987654321',
    discordId: 'ModerPro#5678',
    lastActive: '2025-01-15 12:15',
    status: 'online',
    warns: 1,
    notes: 'Активный модератор'
  },
  {
    id: '3',
    nickname: 'Helper_123',
    level: 'Помощник',
    steamId: 'STEAM_0:1:555666777',
    discordId: 'Helper123#9999',
    lastActive: '2025-01-14 18:45',
    status: 'offline',
    warns: 0,
    notes: 'Новичок в команде'
  }
];

export default function Index() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState<Partial<Admin>>({
    nickname: '',
    level: '',
    steamId: '',
    discordId: '',
    notes: ''
  });

  const handleLogin = () => {
    if (loginData.username === 'admin' && loginData.password === 'password') {
      setIsAuthenticated(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'vacation': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'В сети';
      case 'offline': return 'Не в сети';
      case 'vacation': return 'В отпуске';
      default: return 'Неизвестно';
    }
  };

  const handleAddAdmin = () => {
    if (newAdmin.nickname && newAdmin.level) {
      const admin: Admin = {
        id: Date.now().toString(),
        nickname: newAdmin.nickname,
        level: newAdmin.level,
        steamId: newAdmin.steamId || '',
        discordId: newAdmin.discordId || '',
        lastActive: new Date().toLocaleString('ru-RU'),
        status: 'offline',
        warns: 0,
        notes: newAdmin.notes || ''
      };
      setAdmins([...admins, admin]);
      setNewAdmin({ nickname: '', level: '', steamId: '', discordId: '', notes: '' });
      setIsAddingAdmin(false);
    }
  };

  const handleDeleteAdmin = (id: string) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center gradient-button animate-glow">
                <Icon name="Shield" size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              SAMP Admin Panel
            </h1>
            <p className="text-gray-300 text-lg">
              Система управления администрацией сервера
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Admin Table */}
            <Card className="gradient-card border-0 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Icon name="Users" size={24} />
                  Состав Администрации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Никнейм</TableHead>
                        <TableHead className="text-gray-300">Должность</TableHead>
                        <TableHead className="text-gray-300">Статус</TableHead>
                        <TableHead className="text-gray-300">Последняя активность</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.map((admin) => (
                        <TableRow key={admin.id} className="border-gray-700 hover:bg-gray-800/50">
                          <TableCell className="text-white font-medium">
                            {admin.nickname}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-primary border-primary">
                              {admin.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(admin.status)}`} />
                              <span className="text-gray-300 text-sm">
                                {getStatusText(admin.status)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300 text-sm">
                            {admin.lastActive}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Login Panel */}
            <Card className="gradient-card border-0 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Icon name="Lock" size={24} />
                  Панель Управления
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-gray-300">Логин</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Введите логин"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-300">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Введите пароль"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <Button 
                  onClick={handleLogin}
                  className="w-full gradient-button hover:opacity-90 transition-opacity"
                >
                  <Icon name="LogIn" size={20} className="mr-2" />
                  Войти в панель
                </Button>
                <div className="text-center text-gray-400 text-sm">
                  Тестовый доступ: admin / password
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="gradient-card border-0 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Всего администраторов</p>
                    <p className="text-2xl font-bold text-white">{admins.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="Users" size={24} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">В сети</p>
                    <p className="text-2xl font-bold text-white">
                      {admins.filter(a => a.status === 'online').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Icon name="Wifi" size={24} className="text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Предупреждения</p>
                    <p className="text-2xl font-bold text-white">
                      {admins.reduce((sum, admin) => sum + admin.warns, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Icon name="AlertTriangle" size={24} className="text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center gradient-button">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-300">Управление администрацией сервера</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Icon name="LogOut" size={20} className="mr-2" />
            Выйти
          </Button>
        </div>

        {/* Management Panel */}
        <Card className="gradient-card border-0 mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Icon name="Settings" size={24} />
                Управление Администраторами
              </div>
              <Dialog open={isAddingAdmin} onOpenChange={setIsAddingAdmin}>
                <DialogTrigger asChild>
                  <Button className="gradient-button hover:opacity-90">
                    <Icon name="Plus" size={20} className="mr-2" />
                    Добавить администратора
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Новый администратор</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Никнейм</Label>
                      <Input
                        value={newAdmin.nickname}
                        onChange={(e) => setNewAdmin({...newAdmin, nickname: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Введите никнейм"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Должность</Label>
                      <Select value={newAdmin.level} onValueChange={(value) => setNewAdmin({...newAdmin, level: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Выберите должность" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="Помощник">Помощник</SelectItem>
                          <SelectItem value="Модератор">Модератор</SelectItem>
                          <SelectItem value="Старший Модератор">Старший Модератор</SelectItem>
                          <SelectItem value="Администратор">Администратор</SelectItem>
                          <SelectItem value="Главный Администратор">Главный Администратор</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Steam ID</Label>
                      <Input
                        value={newAdmin.steamId}
                        onChange={(e) => setNewAdmin({...newAdmin, steamId: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="STEAM_0:1:123456789"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Discord ID</Label>
                      <Input
                        value={newAdmin.discordId}
                        onChange={(e) => setNewAdmin({...newAdmin, discordId: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Username#1234"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Заметки</Label>
                      <Textarea
                        value={newAdmin.notes}
                        onChange={(e) => setNewAdmin({...newAdmin, notes: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Дополнительная информация"
                      />
                    </div>
                    <Button onClick={handleAddAdmin} className="w-full gradient-button">
                      Добавить администратора
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Admin Table with Management */}
        <Card className="gradient-card border-0 animate-fade-in">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Никнейм</TableHead>
                    <TableHead className="text-gray-300">Должность</TableHead>
                    <TableHead className="text-gray-300">Steam ID</TableHead>
                    <TableHead className="text-gray-300">Discord</TableHead>
                    <TableHead className="text-gray-300">Статус</TableHead>
                    <TableHead className="text-gray-300">Предупреждения</TableHead>
                    <TableHead className="text-gray-300">Последняя активность</TableHead>
                    <TableHead className="text-gray-300">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id} className="border-gray-700 hover:bg-gray-800/50">
                      <TableCell className="text-white font-medium">
                        {admin.nickname}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-primary border-primary">
                          {admin.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono text-sm">
                        {admin.steamId}
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        {admin.discordId}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(admin.status)}`} />
                          <span className="text-gray-300 text-sm">
                            {getStatusText(admin.status)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={admin.warns > 0 ? "destructive" : "secondary"}>
                          {admin.warns}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        {admin.lastActive}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedAdmin(admin)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteAdmin(admin.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}