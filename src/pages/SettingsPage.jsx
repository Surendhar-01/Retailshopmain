import { useStore } from '../store/useStore';
import { firebaseIntegrationNotes } from '../services/firebaseOption';
import { SectionTitle } from '../components/SectionTitle';

export function SettingsPage() {
  const logout = useStore((state) => state.logout);
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);
  const currentUser = useStore((state) => state.currentUser);

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Settings"
        title="App preferences and backend options"
        description="Use localStorage for offline-friendly demo mode now, or switch to Firebase/Firestore or Node/Express with MongoDB for production."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="panel p-5">
          <h3 className="text-lg font-semibold">Preferences</h3>
          <div className="mt-5 space-y-4">
            <div className="panel-muted flex items-center justify-between p-4">
              <div>
                <p className="font-medium">Current role</p>
                <p className="text-sm text-slate-500">{currentUser?.role}</p>
              </div>
              <button className="btn-secondary" type="button" onClick={logout}>
                Logout
              </button>
            </div>
            <div className="panel-muted p-4">
              <p className="font-medium">Language</p>
              <select className="input mt-3" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="ta">Tamil</option>
              </select>
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <h3 className="text-lg font-semibold">{firebaseIntegrationNotes.title}</h3>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{firebaseIntegrationNotes.summary}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {firebaseIntegrationNotes.collections.map((collection) => (
              <li key={collection} className="panel-muted px-4 py-3">
                {collection}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
