import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../components/common/Button";
import { usePermissions } from "../../context/PermissionsContext";
import { ROLES, ROLE_LABELS, type RoleName } from "../../constants/roles";
import { NAV_ITEMS, DEFAULT_PERMISSIONS, type RolePermissions } from "../../constants/navigation";

export default function Settings() {
  const { permissions, savePermissions, resetToDefaults } = usePermissions();
  const [draft, setDraft] = useState<RolePermissions>(permissions);

  const toggle = (role: RoleName, tabKey: string) => {
    setDraft((prev) => {
      const current = prev[role] ?? [];
      const next = current.includes(tabKey)
        ? current.filter((key) => key !== tabKey)
        : [...current, tabKey];
      return { ...prev, [role]: next };
    });
  };

  const handleSave = () => {
    savePermissions(draft);
    toast.success("Role permissions updated.");
  };

  const handleReset = () => {
    resetToDefaults();
    setDraft(DEFAULT_PERMISSIONS);
    toast.info("Reset to default permissions.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[var(--text-h)]">Settings</h2>
          <p className="mt-1 text-sm text-[var(--text)]/70">
            Choose which tabs are visible to each role in the sidebar.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--canvas)]/50">
              <th className="px-4 py-3 text-sm font-medium text-[var(--text)]">Role</th>
              {NAV_ITEMS.map((item) => (
                <th key={item.key} className="px-4 py-3 text-center text-sm font-medium text-[var(--text)]">
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]/60">
            {Object.values(ROLES).map((role) => (
              <tr key={role}>
                <td className="px-4 py-3 text-sm font-medium text-[var(--text-h)]">{ROLE_LABELS[role]}</td>
                {NAV_ITEMS.map((item) => (
                  <td key={item.key} className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={draft[role]?.includes(item.key) ?? false}
                      onChange={() => toggle(role, item.key)}
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--text)]/50">
        Settings itself is always visible to Fleet Manager only, so a role can't be configured to lock
        everyone out of this page.
      </p>
    </div>
  );
}
