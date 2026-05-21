import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, User, LayoutDashboard, UserPlus } from 'lucide-react';

import PageWrapper from '../../components/layout/PageWrapper';
import { MetricCard, Card, Button, PageHeader, LoadingSpinner, Badge } from '../../components/ui';
import { usuarioService } from '../../services/usuarioService';

function NuevoUsuarioModal({ onClose, onCrear }) {
    const [form, setForm] = useState({
        rut: '', nombreCompleto: '', email: '', contrasena: '', 
        fechaNacimiento: '', numeroTelefono: '', rol: 'PACIENTE'
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onCrear(form);
        setSaving(false);
    };

    const inputStyle = "w-full p-2.5 rounded-lg border border-[#0e9b84]/20 bg-[#f0fdfb] text-sm text-[#0f2421] outline-none focus:ring-2 focus:ring-[#0e9b84]/30 mb-3";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                <h2 className="text-lg font-bold text-[#0f2421] mb-4">Crear Nuevo Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <input className={inputStyle} placeholder="Nombre Completo" onChange={e => setForm({...form, nombreCompleto: e.target.value})} required />
                    <input className={inputStyle} placeholder="RUT (12.345.678-9)" onChange={e => setForm({...form, rut: e.target.value})} required />
                    <input className={inputStyle} type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} required />
                    <input className={inputStyle} type="password" placeholder="Contraseña" onChange={e => setForm({...form, contrasena: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-2">
                        <input className={inputStyle} type="date" onChange={e => setForm({...form, fechaNacimiento: e.target.value})} />
                        <input className={inputStyle} placeholder="Teléfono" onChange={e => setForm({...form, numeroTelefono: e.target.value})} />
                    </div>
                    <select className={inputStyle} onChange={e => setForm({...form, rol: e.target.value})}>
                        <option value="PACIENTE">Paciente</option>
                        <option value="MEDICO">Médico</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                    <div className="flex gap-2 mt-4">
                        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={saving}>{saving ? 'Creando...' : 'Guardar Usuario'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminUsuariosDashboard() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => { cargarUsuarios(); }, []);

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const response = await usuarioService.listarTodos();
            console.log("Respuesta del BFF (Usuarios):", response.data);
            setUsuarios(Array.isArray(response.data) ? response.data : []);
        } catch (err) { 
            console.error("Error al cargar usuarios:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleCrear = async (datos) => {
        try {
            await usuarioService.crear(datos);
            setShowModal(false);
            await cargarUsuarios();
        } catch (err) { alert("Error al crear usuario"); }
    };

    const stats = {
        total: usuarios.length,
        admins: usuarios.filter(u => u.rol === 'ADMIN').length,
        pacientes: usuarios.filter(u => u.rol === 'PACIENTE').length,
        medicos: usuarios.filter(u => u.rol === 'MEDICO').length
    };

    return (
        <PageWrapper>
            {showModal && <NuevoUsuarioModal onClose={() => setShowModal(false)} onCrear={handleCrear} />}

            <PageHeader
                title="Gestión de Usuarios"
                subtitle="Administración de cuentas del sistema RedNorte"
                action={<Button onClick={() => setShowModal(true)} icon={<UserPlus size={16}/>}>Crear Usuario</Button>}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: '1.25rem' }}>
                <MetricCard label="Total Usuarios" value={stats.total} badge="Activos" icon={<Users size={20}/>} />
                <MetricCard label="Administradores" value={stats.admins} badge="Acceso Total" icon={<ShieldCheck size={20}/>} />
                <MetricCard label="Pacientes" value={stats.pacientes} badge="Registrados" icon={<User size={20}/>} />
                <MetricCard label="Médicos" value={stats.medicos} badge="Equipo Médico" icon={<LayoutDashboard size={20}/>} />
            </div>

            <Card title="Usuarios del Sistema">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase' }}>
                                <th className="p-4 text-left">RUT</th>
                                <th className="p-4 text-left">Nombre Completo</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Rol</th>
                                <th className="p-4 text-left">Teléfono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(u => (
                                <tr key={u.id} style={{ borderTop: '1px solid rgba(14,155,132,0.08)' }}>
                                    <td className="p-4 font-semibold text-sm">{u.rut}</td>
                                    <td className="p-4 text-sm">{u.nombreCompleto}</td>
                                    <td className="p-4 text-sm text-gray-500">{u.email}</td>
                                    <td className="p-4"><Badge>{u.rol}</Badge></td>
                                    <td className="p-4 text-sm text-gray-500">{u.numeroTelefono}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </PageWrapper>
    );
}