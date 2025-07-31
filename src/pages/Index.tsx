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

interface ActionLog {
  id: string;
  action: string;
  performedBy: string;
  date: string;
  details: string;
}

interface LoginAccount {
  id: string;
  username: string;
  password: string;
  role: 'superadmin' | 'admin';
  createdBy: string;
  createdAt: string;
}

interface Admin {
  id: string;
  nickname: string;
  level: string;
  department: string;
  discordId: string;
  status: 'active' | 'vacation' | 'frozen';
  warns: number;
  notes: string;
  actionHistory: ActionLog[];
}

const mockAdmins: Admin[] = [
  {
    id: '1',
    nickname: 'SuperAdmin_RUS',
    level: 'Главный Администратор',
    department: 'Отдел Модерации',
    discordId: 'SuperAdmin#1234',

    status: 'active',
    warns: 0,
    notes: 'Опытный администратор',
    actionHistory: [
      { id: '1', action: 'Назначен главным администратором', performedBy: 'Zakhar_Kutikov', date: '2024-12-01 10:00', details: 'Первоначальное назначение' },
      { id: '2', action: 'Обновлен Discord ID', performedBy: 'Zakhar_Kutikov', date: '2025-01-10 15:30', details: 'Изменен Discord контакт' }
    ]
  },
  {
    id: '2',
    nickname: 'ModerPro',
    level: 'Старший Модератор',
    department: 'Отдел Администрации',
    discordId: 'ModerPro#5678',

    status: 'active',
    warns: 1,
    notes: 'Активный модератор',
    actionHistory: [
      { id: '1', action: 'Назначен старшим модератором', performedBy: 'Zakhar_Kutikov', date: '2024-11-15 14:20', details: 'Повышение с модератора' },
      { id: '2', action: 'Выдано предупреждение', performedBy: 'SuperAdmin_RUS', date: '2025-01-05 16:45', details: 'Нарушение процедуры модерации' }
    ]
  },
  {
    id: '3',
    nickname: 'Helper_123',
    level: 'Помощник',
    department: 'Отдел Поддержки',
    discordId: 'Helper123#9999',

    status: 'vacation',
    warns: 0,
    notes: 'Новичок в команде',
    actionHistory: [
      { id: '1', action: 'Назначен помощником', performedBy: 'Zakhar_Kutikov', date: '2025-01-01 12:00', details: 'Новый сотрудник' },
      { id: '2', action: 'Переведен в отпуск', performedBy: 'SuperAdmin_RUS', date: '2025-01-14 18:45', details: 'Запрос на отпуск одобрен' }
    ]
  }
];

const mockLogins: LoginAccount[] = [
  {
    id: '1',
    username: 'Zakhar_Kutikov',
    password: 'zaxartop',
    role: 'superadmin',
    createdBy: 'System',
    createdAt: '2024-01-01 00:00'
  }
];

export default function Index() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [loginAccounts, setLoginAccounts] = useState<LoginAccount[]>(mockLogins);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<LoginAccount | null>(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState<Admin | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Partial<Admin>>({});
  const [isAddingLogin, setIsAddingLogin] = useState(false);
  const [newLogin, setNewLogin] = useState<Partial<LoginAccount>>({});
  const [isGivingWarning, setIsGivingWarning] = useState(false);
  const [warnAdmin, setWarnAdmin] = useState<Admin | null>(null);
  const [warnReason, setWarnReason] = useState('');
  const [newAdmin, setNewAdmin] = useState<Partial<Admin>>({
    nickname: '',
    level: '',
    department: '',
    discordId: '',
    notes: ''
  });

  const handleLogin = () => {
    const account = loginAccounts.find(acc => 
      acc.username === loginData.username && acc.password === loginData.password
    );
    if (account) {
      setIsAuthenticated(true);
      setCurrentUser(account);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'vacation': return 'bg-yellow-500';
      case 'frozen': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'vacation': return 'В отпуске';
      case 'frozen': return 'В заморозке';
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
        status: 'active',
        warns: 0,
        notes: newAdmin.notes || '',
        actionHistory: [{
          id: '1',
          action: 'Добавлен в команду',
          performedBy: currentUser?.username || 'System',
          date: new Date().toLocaleString('ru-RU'),
          details: 'Новый администратор добавлен в систему'
        }]
      };
      setAdmins([...admins, admin]);
      setNewAdmin({ nickname: '', level: '', department: '', discordId: '', notes: '' });
      setIsAddingAdmin(false);
    }
  };

  const handleDeleteAdmin = (id: string) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setIsEditingAdmin(true);
  };

  const handleUpdateAdmin = () => {
    if (editingAdmin.id) {
      const updatedAdmins = admins.map(admin => {
        if (admin.id === editingAdmin.id) {
          const updatedAdmin = { ...admin, ...editingAdmin };
          updatedAdmin.actionHistory = [
            ...admin.actionHistory,
            {
              id: Date.now().toString(),
              action: 'Данные обновлены',
              performedBy: 'Zakhar_Kutikov',
              date: new Date().toLocaleString('ru-RU'),
              details: 'Профиль администратора обновлен'
            }
          ];
          return updatedAdmin;
        }
        return admin;
      });
      setAdmins(updatedAdmins);
      setIsEditingAdmin(false);
      setEditingAdmin({});
    }
  };

  const openAdminProfile = (admin: Admin) => {
    setAdminProfile(admin);
  };

  const handleAddLogin = () => {
    if (newLogin.username && newLogin.password && currentUser?.role === 'superadmin') {
      const login: LoginAccount = {
        id: Date.now().toString(),
        username: newLogin.username,
        password: newLogin.password,
        role: newLogin.role || 'admin',
        createdBy: currentUser.username,
        createdAt: new Date().toLocaleString('ru-RU')
      };
      setLoginAccounts([...loginAccounts, login]);
      setNewLogin({});
      setIsAddingLogin(false);
    }
  };

  const handleGiveWarning = () => {
    if (warnAdmin && warnReason) {
      const updatedAdmins = admins.map(admin => {
        if (admin.id === warnAdmin.id) {
          const updatedAdmin = { ...admin, warns: admin.warns + 1 };
          updatedAdmin.actionHistory = [
            ...admin.actionHistory,
            {
              id: Date.now().toString(),
              action: 'Выдан выговор',
              performedBy: currentUser?.username || 'System',
              date: new Date().toLocaleString('ru-RU'),
              details: `Причина: ${warnReason}`
            }
          ];
          return updatedAdmin;
        }
        return admin;
      });
      setAdmins(updatedAdmins);
      setIsGivingWarning(false);
      setWarnAdmin(null);
      setWarnReason('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="https://cdn.poehali.dev/files/3f81722e-0774-453d-9a40-6bbc7e41198b.png" 
                alt="AURORA Logo" 
                className="w-24 h-16 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              AURORA ADMINS
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
                        <TableHead className="text-gray-300">Отдел</TableHead>
                        <TableHead className="text-gray-300">Статус</TableHead>

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
                          <TableCell className="text-gray-300 text-sm">
                            {admin.department}
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
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openAdminProfile(admin)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                              Профиль
                            </Button>
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
                  Доступ для суперадмина
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
                    <p className="text-gray-300 text-sm">Активных</p>
                    <p className="text-2xl font-bold text-white">
                      {admins.filter(a => a.status === 'active').length}
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
            <img 
              src="https://cdn.poehali.dev/files/3f81722e-0774-453d-9a40-6bbc7e41198b.png" 
              alt="AURORA Logo" 
              className="w-16 h-12 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">AURORA ADMINS</h1>
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
              <div className="flex gap-2">
                <Dialog open={isAddingAdmin} onOpenChange={setIsAddingAdmin}>
                  <DialogTrigger asChild>
                    <Button className="gradient-button hover:opacity-90">
                      <Icon name="Plus" size={20} className="mr-2" />
                      Добавить админа
                    </Button>
                  </DialogTrigger>
                </Dialog>
                {currentUser?.role === 'superadmin' && (
                  <Dialog open={isAddingLogin} onOpenChange={setIsAddingLogin}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                        <Icon name="UserPlus" size={20} className="mr-2" />
                        Создать логин
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                )}
              </div>
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
                      <Label className="text-gray-300">Отдел</Label>
                      <Select value={newAdmin.department} onValueChange={(value) => setNewAdmin({...newAdmin, department: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Выберите отдел" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="Отдел Модерации">Отдел Модерации</SelectItem>
                          <SelectItem value="Отдел Администрации">Отдел Администрации</SelectItem>
                          <SelectItem value="Отдел Поддержки">Отдел Поддержки</SelectItem>
                          <SelectItem value="Отдел Развития">Отдел Развития</SelectItem>
                          <SelectItem value="Отдел Безопасности">Отдел Безопасности</SelectItem>
                        </SelectContent>
                      </Select>
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
            </div>
          )}
        </div>

        {/* Admin Table with Management */}
        <Card className="gradient-card border-0 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white mb-6 text-center">
              AURORA ADMINS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Никнейм</TableHead>
                    <TableHead className="text-gray-300">Должность</TableHead>
                    <TableHead className="text-gray-300">Отдел</TableHead>
                    <TableHead className="text-gray-300">Discord</TableHead>
                    <TableHead className="text-gray-300">Статус</TableHead>
                    <TableHead className="text-gray-300">Предупреждения</TableHead>
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
                      <TableCell className="text-gray-300 text-sm">
                        {admin.department}
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

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAdminProfile(admin)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <Icon name="User" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAdmin(admin)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setWarnAdmin(admin);
                              setIsGivingWarning(true);
                            }}
                            className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/20"
                          >
                            <Icon name="AlertTriangle" size={16} />
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

        {/* Edit Admin Dialog */}
        <Dialog open={isEditingAdmin} onOpenChange={setIsEditingAdmin}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Редактирование администратора</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Никнейм</Label>
                <Input
                  value={editingAdmin.nickname || ''}
                  onChange={(e) => setEditingAdmin({...editingAdmin, nickname: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Должность</Label>
                <Select value={editingAdmin.level || ''} onValueChange={(value) => setEditingAdmin({...editingAdmin, level: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
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
                <Label className="text-gray-300">Статус</Label>
                <Select value={editingAdmin.status || ''} onValueChange={(value) => setEditingAdmin({...editingAdmin, status: value as any})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="vacation">В отпуске</SelectItem>
                    <SelectItem value="frozen">В заморозке</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Отдел</Label>
                <Select value={editingAdmin.department || ''} onValueChange={(value) => setEditingAdmin({...editingAdmin, department: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Отдел Модерации">Отдел Модерации</SelectItem>
                    <SelectItem value="Отдел Администрации">Отдел Администрации</SelectItem>
                    <SelectItem value="Отдел Поддержки">Отдел Поддержки</SelectItem>
                    <SelectItem value="Отдел Развития">Отдел Развития</SelectItem>
                    <SelectItem value="Отдел Безопасности">Отдел Безопасности</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Discord ID</Label>
                <Input
                  value={editingAdmin.discordId || ''}
                  onChange={(e) => setEditingAdmin({...editingAdmin, discordId: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Предупреждения</Label>
                <Input
                  type="number"
                  value={editingAdmin.warns || 0}
                  onChange={(e) => setEditingAdmin({...editingAdmin, warns: parseInt(e.target.value) || 0})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Заметки</Label>
                <Textarea
                  value={editingAdmin.notes || ''}
                  onChange={(e) => setEditingAdmin({...editingAdmin, notes: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <Button onClick={handleUpdateAdmin} className="w-full gradient-button">
                Сохранить изменения
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Admin Profile Dialog */}
        <Dialog open={!!adminProfile} onOpenChange={() => setAdminProfile(null)}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Icon name="User" size={24} />
                Профиль администратора: {adminProfile?.nickname}
              </DialogTitle>
            </DialogHeader>
            {adminProfile && (
              <div className="space-y-6">
                {/* Admin Info */}
                <Card className="gradient-card border-gray-700">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-400 text-sm">Никнейм</Label>
                        <p className="text-white font-medium">{adminProfile.nickname}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Должность</Label>
                        <Badge variant="outline" className="text-primary border-primary">
                          {adminProfile.level}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Отдел</Label>
                        <p className="text-gray-300 text-sm">{adminProfile.department}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Discord</Label>
                        <p className="text-gray-300 text-sm">{adminProfile.discordId}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Статус</Label>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(adminProfile.status)}`} />
                          <span className="text-gray-300 text-sm">
                            {getStatusText(adminProfile.status)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Предупреждения</Label>
                        <Badge variant={adminProfile.warns > 0 ? "destructive" : "secondary"}>
                          {adminProfile.warns}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-gray-400 text-sm">Заметки</Label>
                        <p className="text-gray-300 text-sm">{adminProfile.notes || 'Нет заметок'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action History */}
                <Card className="gradient-card border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Icon name="History" size={20} />
                      История действий
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {adminProfile.actionHistory.map((action) => (
                        <div key={action.id} className="border-l-2 border-primary pl-4 pb-3">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-white font-medium text-sm">{action.action}</h4>
                            <span className="text-gray-400 text-xs">{action.date}</span>
                          </div>
                          <p className="text-gray-300 text-sm mb-1">{action.details}</p>
                          <p className="text-gray-400 text-xs">
                            Выполнил: <span className="text-primary">{action.performedBy}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Login Dialog - только для суперадмина */}
        <Dialog open={isAddingLogin} onOpenChange={setIsAddingLogin}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Создание нового логина</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Логин</Label>
                <Input
                  value={newLogin.username || ''}
                  onChange={(e) => setNewLogin({...newLogin, username: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Введите логин"
                />
              </div>
              <div>
                <Label className="text-gray-300">Пароль</Label>
                <Input
                  value={newLogin.password || ''}
                  onChange={(e) => setNewLogin({...newLogin, password: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Введите пароль"
                />
              </div>
              <div>
                <Label className="text-gray-300">Роль</Label>
                <Select value={newLogin.role || 'admin'} onValueChange={(value) => setNewLogin({...newLogin, role: value as any})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="superadmin">Суперадмин</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddLogin} className="w-full gradient-button">
                Создать логин
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Give Warning Dialog */}
        <Dialog open={isGivingWarning} onOpenChange={setIsGivingWarning}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Выдача выговора</DialogTitle>
            </DialogHeader>
            {warnAdmin && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-white font-medium">{warnAdmin.nickname}</p>
                  <p className="text-gray-300 text-sm">{warnAdmin.level}</p>
                  <p className="text-gray-400 text-xs">Текущих выговоров: {warnAdmin.warns}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Причина выговора</Label>
                  <Textarea
                    value={warnReason}
                    onChange={(e) => setWarnReason(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Укажите причину выговора..."
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={handleGiveWarning} 
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                  disabled={!warnReason.trim()}
                >
                  <Icon name="AlertTriangle" size={20} className="mr-2" />
                  Выдать выговор
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}