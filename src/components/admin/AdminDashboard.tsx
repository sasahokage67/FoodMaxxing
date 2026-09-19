import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Venue, KitchenInquiry } from '../../types';
import { formatPhoneNumber, isPhoneValid } from '../../utils/phoneFormatter';
import {
  Building2,
  Check,
  X,
  Trash2,
  Clock,
  Phone,
  User,
  MapPin,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Plus,
  Power,
  Store
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    lang,
    adminPhone,
    inquiries,
    approvedKitchenPhones,
    approveInquiry,
    rejectInquiry,
    approveAllInquiries,
    deleteInquiry,
    lockAdmin,
    venues,
    addVenue,
    updateVenue,
    deleteVenue,
    toggleVenueActive
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Modal states for venue CRUD
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  // Form states for Add Venue
  const [addName, setAddName] = useState('');
  const [addLocation, setAddLocation] = useState('');
  const [addPhone, setAddPhone] = useState('+7(');
  const [addPrepTime, setAddPrepTime] = useState('5-8 мин');
  const [addOpeningHours, setAddOpeningHours] = useState('08:30 - 18:00');
  const [addError, setAddError] = useState('');

  // Form states for Edit Venue
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPrepTime, setEditPrepTime] = useState('');
  const [editOpeningHours, setEditOpeningHours] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editIsPrimary, setEditIsPrimary] = useState(false);
  const [editError, setEditError] = useState('');

  // Helper inquiry status checks
  const isPendingInquiry = (i: KitchenInquiry) => !i.status || i.status === 'pending';
  const isApprovedInquiry = (i: KitchenInquiry) => i.status === 'approved';
  const isRejectedInquiry = (i: KitchenInquiry) => i.status === 'rejected';

  const pendingCount = inquiries.filter(isPendingInquiry).length;
  const approvedCount = inquiries.filter(isApprovedInquiry).length;
  const rejectedCount = inquiries.filter(isRejectedInquiry).length;

  const filteredInquiries = inquiries.filter(i => {
    if (activeFilter === 'pending') return isPendingInquiry(i);
    if (activeFilter === 'approved') return isApprovedInquiry(i);
    if (activeFilter === 'rejected') return isRejectedInquiry(i);
    return true;
  });

  const showNotification = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 4000);
  };

  const handleApproveAll = () => {
    approveAllInquiries();
    showNotification(
      lang === 'kz'
        ? 'Барлық асханалар сәтті қабылданды және жүйеге қосылды'
        : lang === 'en'
        ? 'All kitchens and inquiries have been approved and activated'
        : 'Все заведения и заявки успешно приняты и подключены к системе'
    );
  };

  const handleApproveSingle = (id: string, name: string) => {
    approveInquiry(id);
    showNotification(
      lang === 'kz'
        ? '«' + name + '» сәтті қабылданды'
        : lang === 'en'
        ? '"' + name + '" approved successfully'
        : 'Заведение «' + name + '» успешно принято и добавлено в систему'
    );
  };

  const handleOpenAddModal = () => {
    setAddName('');
    setAddLocation('');
    setAddPhone('+7(');
    setAddPrepTime('5-8 мин');
    setAddOpeningHours('08:30 - 18:00');
    setAddError('');
    setIsAddModalOpen(true);
  };

  const handleSaveNewVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) {
      setAddError(lang === 'kz' ? 'Асхана атауын енгізіңіз' : lang === 'en' ? 'Enter venue name' : 'Введите название столовой');
      return;
    }
    if (!addLocation.trim()) {
      setAddError(lang === 'kz' ? 'Орналасқан жерін енгізіңіз' : lang === 'en' ? 'Enter venue location' : 'Укажите корпус и этаж');
      return;
    }
    if (!isPhoneValid(addPhone)) {
      setAddError(lang === 'kz' ? 'Телефон нөмірін толық енгізіңіз' : lang === 'en' ? 'Enter complete phone number' : 'Введите полный номер телефона (10 цифр)');
      return;
    }

    addVenue({
      name: addName.trim(),
      location: addLocation.trim(),
      phone: addPhone.trim(),
      prepTime: addPrepTime.trim() || '5-10 мин',
      openingHours: addOpeningHours.trim() || '08:30 - 18:00',
      isActive: true,
      isPrimary: venues.length === 0
    });

    setIsAddModalOpen(false);
    showNotification(
      lang === 'kz'
        ? '«' + addName.trim() + '» сәтті қосылды'
        : lang === 'en'
        ? '"' + addName.trim() + '" created successfully'
        : 'Заведение «' + addName.trim() + '» успешно создано и активно'
    );
  };

  const handleOpenEditModal = (venue: Venue) => {
    setEditingVenue(venue);
    setEditName(venue.name);
    setEditLocation(venue.location);
    setEditPhone(formatPhoneNumber(venue.phone));
    setEditPrepTime(venue.prepTime || '5-8 мин');
    setEditOpeningHours(venue.openingHours || '08:30 - 18:00');
    setEditIsActive(venue.isActive);
    setEditIsPrimary(!!venue.isPrimary);
    setEditError('');
  };

  const handleSaveEditVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVenue) return;

    if (!editName.trim()) {
      setEditError(lang === 'kz' ? 'Асхана атауын енгізіңіз' : lang === 'en' ? 'Enter venue name' : 'Введите название столовой');
      return;
    }
    if (!editLocation.trim()) {
      setEditError(lang === 'kz' ? 'Орналасқан жерін енгізіңіз' : lang === 'en' ? 'Enter venue location' : 'Укажите корпус и этаж');
      return;
    }

    updateVenue(editingVenue.id, {
      name: editName.trim(),
      location: editLocation.trim(),
      phone: editPhone.trim(),
      prepTime: editPrepTime.trim() || '5-8 мин',
      openingHours: editOpeningHours.trim() || '08:30 - 18:00',
      isActive: editIsActive,
      isPrimary: editIsPrimary
    });

    setEditingVenue(null);
    showNotification(
      lang === 'kz'
        ? '«' + editName.trim() + '» өзгертілді'
        : lang === 'en'
        ? '"' + editName.trim() + '" updated successfully'
        : 'Данные заведения «' + editName.trim() + '» сохранены'
    );
  };

  const handleDeleteVenue = (venue: Venue) => {
    const confirmed = window.confirm(
      lang === 'kz'
        ? 'Шынымен «' + venue.name + '» заведениесін жойғыңыз келе ме?'
        : lang === 'en'
        ? 'Are you sure you want to delete "' + venue.name + '"?'
        : 'Вы действительно хотите удалить заведение «' + venue.name + '»?'
    );

    if (confirmed) {
      deleteVenue(venue.id);
      showNotification(
        lang === 'kz'
          ? '«' + venue.name + '» жойылды'
          : lang === 'en'
          ? '"' + venue.name + '" deleted'
          : 'Заведение «' + venue.name + '» удалено из системы'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top Banner / Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
              <span>
                {lang === 'kz' ? 'Бас әкімшілік панелі' : lang === 'en' ? 'Super Admin Panel' : 'Панель главного администратора'}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {lang === 'kz' ? 'Асханалар мен өтінімдерді басқару' : lang === 'en' ? 'Venues & Partner Kitchen Management' : 'Управление заведениями и заявками кухонь'}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                {lang === 'kz'
                  ? 'Авторизация нөмірі: ' + adminPhone + '. Асханаларды өңдеңіз, өшіріңіз немесе жаңа өтінімдерді бір батырмамен қабылдаңыз.'
                  : lang === 'en'
                  ? 'Authenticated Admin: ' + adminPhone + '. Full control to edit, delete venues and approve partner cafeteria requests in 1 click.'
                  : 'Авторизованный администратор: ' + adminPhone + '. Полное управление столовыми (редактирование, удаление), моментальное принятие заявок и допуск к системе.'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleApproveAll}
              disabled={pendingCount === 0}
              className={'px-4 py-2.5 rounded-2xl font-black text-xs transition-all shadow-lg ' + (
                pendingCount > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white cursor-pointer ring-2 ring-emerald-400/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              )}
            >
              <span>
                {lang === 'kz'
                  ? 'Барлық өтінімдерді қабылдау (' + pendingCount + ')'
                  : lang === 'en'
                  ? 'Approve All Inquiries (' + pendingCount + ')'
                  : 'Принять все заявки (' + pendingCount + ')'}
              </span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer"
            >
              <span>{lang === 'kz' ? 'Асхана қосу' : lang === 'en' ? 'Add Venue' : 'Добавить столовую'}</span>
            </button>

            <button
              onClick={lockAdmin}
              className="px-3.5 py-2.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white rounded-2xl text-xs font-bold transition-colors border border-red-800/60 cursor-pointer"
              title="Выйти из режима администратора"
            >
              <span>{lang === 'kz' ? 'Шығу' : lang === 'en' ? 'Exit Admin' : 'Выйти'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 px-5 py-4 rounded-2xl shadow-sm flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-2.5 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            {lang === 'kz' ? 'Барлық асханалар' : lang === 'en' ? 'Total Venues' : 'Всего столовых'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono">
            {venues.length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            {lang === 'kz' ? 'Белсенді заведениялар' : lang === 'en' ? 'Active Venues' : 'Активных столовых'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            {venues.filter(v => v.isActive).length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            {lang === 'kz' ? 'Шешім күтуде' : lang === 'en' ? 'Pending Review' : 'Заявок на рассмотрении'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
            {pendingCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
            {lang === 'kz' ? 'Рұқсат етілген нөмірлер' : lang === 'en' ? 'Authorized Kitchen Staff' : 'Допущенных поваров'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 font-mono">
            {approvedKitchenPhones.length}
          </div>
        </div>
      </div>

      {/* SECTION 1: VENUES MANAGEMENT */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Store className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                {lang === 'kz' ? 'Асханаларды басқару (өңдеу және өшіру)' : lang === 'en' ? 'Venue Management (Edit & Delete)' : 'Управление заведениями (редактирование и удаление)'}
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              {lang === 'kz'
                ? 'Жүйедегі кез келген асхананы өңдеуге, өшіруге немесе белсенділігін өзгертуге болады'
                : lang === 'en'
                ? 'Edit cafeteria details, manage phone access, change preparation time or delete any venue'
                : 'Полный контроль: изменение названия, локации, привязанного номера телефона, времени готовки и удаление столовых'}
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="self-start sm:self-auto px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'kz' ? 'Жаңа асхана қосу' : lang === 'en' ? 'Add New Venue' : 'Добавить новую столовую'}</span>
          </button>
        </div>

        {venues.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm font-bold text-gray-600">
              {lang === 'kz' ? 'Жүйеде асханалар жоқ' : lang === 'en' ? 'No venues configured in system' : 'В системе нет заведений'}
            </p>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors"
            >
              {lang === 'kz' ? 'Асхана қосу' : lang === 'en' ? 'Add Venue' : 'Создать заведение'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {venues.map(venue => (
              <div
                key={venue.id}
                className={'rounded-2xl border p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden bg-white ' + (
                  venue.isActive ? 'border-gray-200' : 'border-gray-200 opacity-65 bg-gray-50/50'
                )}
              >
                {/* Card Header & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {venue.isPrimary && (
                        <span className="text-[10px] font-extrabold uppercase bg-orange-600 text-white px-2 py-0.5 rounded-md">
                          {lang === 'kz' ? 'Негізгі' : lang === 'en' ? 'Primary' : 'Основное'}
                        </span>
                      )}
                      <span
                        className={'text-[10px] font-bold px-2 py-0.5 rounded-md ' + (
                          venue.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {venue.isActive
                          ? (lang === 'kz' ? 'Белсенді' : lang === 'en' ? 'Active' : 'Принимает заказы')
                          : (lang === 'kz' ? 'Өшірулі' : lang === 'en' ? 'Inactive' : 'Скрыто')}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-gray-900 leading-tight pt-1">
                      {venue.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(venue)}
                      className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                      title="Редактировать"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVenue(venue)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Удалить заведение"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-gray-600 font-medium">
                  <div className="flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{venue.location}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span className="font-bold text-gray-900 font-mono">{venue.phone}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>Готовка: <strong>{venue.prepTime || '5-8 мин'}</strong></span>
                  </div>
                </div>

                {/* Action buttons footer */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleVenueActive(venue.id)}
                    className={'flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer ' + (
                      venue.isActive
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                    )}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>
                      {venue.isActive
                        ? (lang === 'kz' ? 'Өшіру' : lang === 'en' ? 'Disable' : 'Приостановить')
                        : (lang === 'kz' ? 'Қосу' : lang === 'en' ? 'Enable' : 'Активировать')}
                    </span>
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(venue)}
                    className="py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {lang === 'kz' ? 'Өңдеу' : lang === 'en' ? 'Edit' : 'Изменить'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: INQUIRIES & APPLICATIONS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              {lang === 'kz' ? 'Асханалардың өтінімдер тізімі' : lang === 'en' ? 'Kitchen Applications & Requests' : 'Список входящих заявок от заведений'}
            </h2>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ' + (
                activeFilter === 'all'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {lang === 'kz' ? 'Барлығы' : lang === 'en' ? 'All' : 'Все'} ({inquiries.length})
            </button>

            <button
              onClick={() => setActiveFilter('pending')}
              className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ' + (
                activeFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              )}
            >
              {lang === 'kz' ? 'Күтуде' : lang === 'en' ? 'Pending' : 'Ожидают'} ({pendingCount})
            </button>

            <button
              onClick={() => setActiveFilter('approved')}
              className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ' + (
                activeFilter === 'approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              )}
            >
              {lang === 'kz' ? 'Қабылданғандар' : lang === 'en' ? 'Approved' : 'Одобренные'} ({approvedCount})
            </button>

            <button
              onClick={() => setActiveFilter('rejected')}
              className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ' + (
                activeFilter === 'rejected'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              )}
            >
              {lang === 'kz' ? 'Қабылданбағандар' : lang === 'en' ? 'Rejected' : 'Отклоненные'} ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-500">
              {lang === 'kz' ? 'Бұл санатта өтінімдер жоқ' : lang === 'en' ? 'No applications in this category' : 'В этой категории пока нет заявок'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInquiries.map(inquiry => {
              const isPending = isPendingInquiry(inquiry);
              const isApproved = isApprovedInquiry(inquiry);
              const isRejected = isRejectedInquiry(inquiry);

              return (
                <div
                  key={inquiry.id}
                  className={'bg-white rounded-3xl border p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden ' + (
                    isPending
                      ? 'border-amber-300 ring-1 ring-amber-100'
                      : isApproved
                      ? 'border-emerald-300 bg-emerald-50/10'
                      : 'border-gray-200 opacity-75'
                  )}
                >
                  {/* Status Tag */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span
                        className={'inline-flex items-center space-x-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ' + (
                          isPending
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : isApproved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        )}
                      >
                        {isPending && <span>{lang === 'kz' ? 'Шешім күтуде' : lang === 'en' ? 'Pending' : 'Ожидает решения'}</span>}
                        {isApproved && (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>{lang === 'kz' ? 'Қабылданды • Белсенді' : lang === 'en' ? 'Approved & Live' : 'Одобрено • Активно'}</span>
                          </>
                        )}
                        {isRejected && <span>{lang === 'kz' ? 'Қабылданбады' : lang === 'en' ? 'Rejected' : 'Отклонено'}</span>}
                      </span>
                      <h3 className="font-black text-base text-gray-900 leading-tight">
                        {inquiry.kitchenName}
                      </h3>
                    </div>

                    <button
                      onClick={() => deleteInquiry(inquiry.id)}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                      title="Удалить запись"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs text-gray-600 font-medium">
                    <div className="flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{inquiry.locationName || 'Локация не указана'}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span>{inquiry.contactName || 'Представитель столовой'}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                      <span className="font-bold text-gray-900 font-mono">{inquiry.phone}</span>
                    </div>

                    {/* AI Verification Badge */}
                    {inquiry.aiVerified && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-emerald-900 space-y-0.5">
                        <div className="flex items-center space-x-1 font-bold text-emerald-800">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Верификация AI пройдена</span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-mono">
                          БИН: {inquiry.binIin || '040540012390'} • ОКЭД: {inquiry.okedCode || '56.10'}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-gray-400 flex items-center space-x-1 pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(inquiry.createdAt).toLocaleString(lang === 'kz' ? 'kk-KZ' : 'ru-RU')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleApproveSingle(inquiry.id, inquiry.kitchenName)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'kz' ? 'Қабылдау' : lang === 'en' ? 'Accept' : 'Принять'}</span>
                        </button>
                        <button
                          onClick={() => rejectInquiry(inquiry.id)}
                          className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          {lang === 'kz' ? 'Қайтару' : lang === 'en' ? 'Reject' : 'Отклонить'}
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <div className="w-full flex items-center justify-between text-xs">
                        <span className="text-emerald-700 font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Доступ открыт и заведение активно</span>
                        </span>
                        <button
                          onClick={() => rejectInquiry(inquiry.id)}
                          className="text-gray-400 hover:text-gray-700 text-[11px] underline cursor-pointer"
                        >
                          Отозвать
                        </button>
                      </div>
                    )}

                    {isRejected && (
                      <button
                        onClick={() => handleApproveSingle(inquiry.id, inquiry.kitchenName)}
                        className="w-full py-1.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Одобрить повторно
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: ADD VENUE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gray-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-base">
                  {lang === 'kz' ? 'Жаңа асхананы қосу' : lang === 'en' ? 'Add New Cafeteria' : 'Добавить новую столовую'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewVenue} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">
                  {lang === 'kz' ? 'Асхана атауы' : lang === 'en' ? 'Venue Name' : 'Название столовой'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Столовая «Достык»"
                  value={addName}
                  onChange={e => setAddName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">
                  {lang === 'kz' ? 'Орналасқан жері (корпус, қабат)' : lang === 'en' ? 'Location (Campus, Floor)' : 'Локация (корпус, этаж, адрес)'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Главный корпус, 1 этаж"
                  value={addLocation}
                  onChange={e => setAddLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {lang === 'kz' ? 'Телефон нөмірі (асхана)' : lang === 'en' ? 'Kitchen Phone' : 'Телефон заведения'}
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={16}
                    value={addPhone}
                    onChange={e => setAddPhone(formatPhoneNumber(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {lang === 'kz' ? 'Дайындау уақыты' : lang === 'en' ? 'Preparation Time' : 'Время готовки'}
                  </label>
                  <input
                    type="text"
                    placeholder="Например: 5-8 мин"
                    value={addPrepTime}
                    onChange={e => setAddPrepTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {addError && <p className="text-red-600 font-bold">{addError}</p>}

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {lang === 'kz' ? 'Болдырмау' : lang === 'en' ? 'Cancel' : 'Отмена'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-extrabold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {lang === 'kz' ? 'Сақтау' : lang === 'en' ? 'Create' : 'Создать заведение'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT VENUE */}
      {editingVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gray-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-base">
                  {lang === 'kz' ? 'Асхананы өңдеу' : lang === 'en' ? 'Edit Cafeteria' : 'Редактировать столовую'}
                </h3>
              </div>
              <button
                onClick={() => setEditingVenue(null)}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditVenue} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">
                  {lang === 'kz' ? 'Асхана атауы' : lang === 'en' ? 'Venue Name' : 'Название столовой'}
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">
                  {lang === 'kz' ? 'Орналасқан жері (корпус, қабат)' : lang === 'en' ? 'Location' : 'Локация (корпус, этаж, адрес)'}
                </label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {lang === 'kz' ? 'Телефон нөмірі' : lang === 'en' ? 'Phone' : 'Телефон заведения'}
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={16}
                    value={editPhone}
                    onChange={e => setEditPhone(formatPhoneNumber(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {lang === 'kz' ? 'Дайындау уақыты' : lang === 'en' ? 'Prep Time' : 'Время готовки'}
                  </label>
                  <input
                    type="text"
                    value={editPrepTime}
                    onChange={e => setEditPrepTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Status checkboxes */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={e => setEditIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 border-gray-300 focus:ring-orange-500 cursor-pointer"
                  />
                  <span className="font-bold text-gray-800">
                    {lang === 'kz' ? 'Белсенді (клиенттерге көрінеді)' : lang === 'en' ? 'Active (visible to customers)' : 'Активно (принимает заказы и отображается клиентам)'}
                  </span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsPrimary}
                    onChange={e => setEditIsPrimary(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 border-gray-300 focus:ring-orange-500 cursor-pointer"
                  />
                  <span className="font-bold text-gray-800">
                    {lang === 'kz' ? 'Басты заведение ретінде белгілеу' : lang === 'en' ? 'Mark as primary venue' : 'Сделать основным заведением'}
                  </span>
                </label>
              </div>

              {editError && <p className="text-red-600 font-bold">{editError}</p>}

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const v = editingVenue;
                    setEditingVenue(null);
                    handleDeleteVenue(v);
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'kz' ? 'Жою' : lang === 'en' ? 'Delete' : 'Удалить'}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingVenue(null)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {lang === 'kz' ? 'Болдырмау' : lang === 'en' ? 'Cancel' : 'Отмена'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-extrabold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    {lang === 'kz' ? 'Өзгерістерді сақтау' : lang === 'en' ? 'Save Changes' : 'Сохранить изменения'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
