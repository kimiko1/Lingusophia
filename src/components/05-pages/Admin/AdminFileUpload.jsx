import { useState } from 'react';

const AdminFileUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Limite à 5 Mo et types autorisés
      const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setStatus('Type de fichier non autorisé.');
        setFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setStatus('Fichier trop volumineux (max 5 Mo).');
        setFile(null);
        return;
      }
      setFile(file);
      setStatus('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setStatus('Veuillez sélectionner un fichier.');

    const formData = new FormData();
    formData.append('file', file);

    setStatus('Envoi en cours...');
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      if (res.ok) {
        setStatus('Fichier envoyé avec succès !');
      } else {
        setStatus('Erreur lors de l\'upload.');
      }
    } catch (err) {
      setStatus('Erreur réseau. (' + err.message + ')');
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" onChange={handleChange} />
      <button type="submit">Uploader</button>
      {status && <div>{status}</div>}
    </form>
  );
};

export default AdminFileUpload;
