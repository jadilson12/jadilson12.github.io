import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { site } from '@/lib/site';

const contacts = [
  { name: 'GitHub', icon: FaGithub },
  { name: 'LinkedIn', icon: FaLinkedinIn },
  { name: 'X', icon: FaXTwitter },
];

// Only static elements supported by ImageResponse: the exported PNG needs no browser.
export default function ProfileCard({ photo }: { photo: string }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: 32,
        background: '#080b0b',
        color: '#f5f7f0',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '32px 40px',
          border: '1px solid #38442c',
          borderRadius: 28,
          background:
            'linear-gradient(125deg, #192219 0%, #101510 42%, #0c100e 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: 430,
            height: 430,
            right: -220,
            top: -290,
            border: '1px solid #50652a',
            borderRadius: 215,
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: 530,
            height: 530,
            right: -265,
            top: -340,
            border: '1px solid #2e3b22',
            borderRadius: 265,
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                background: '#c9f31d',
                color: '#10150a',
                borderRadius: 12,
                fontSize: 23,
                fontWeight: 700,
              }}
            >
              JD
            </div>
            <div style={{ fontSize: 31, fontWeight: 700, letterSpacing: -1 }}>
              jadilson.dev
            </div>
          </div>
        </div>

        <div
          style={{ display: 'flex', alignItems: 'center', gap: 46, flex: 1 }}
        >
          <div
            style={{
              display: 'flex',
              padding: 7,
              border: '1px solid #728b3e',
              borderRadius: 27,
              background: '#27301d',
              boxShadow: '0 16px 40px #00000060',
            }}
          >
            {/* The portrait is embedded as a data URL when the PNG is built. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt="Retrato de Jadilson Guedes"
              width={292}
              height={292}
              style={{ borderRadius: 20, objectFit: 'cover' }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 690,
              gap: 12,
            }}
          >
            <div style={{ color: '#a9bb8b', fontSize: 16, letterSpacing: 4 }}>
              SOFTWARE COM PROPÓSITO
            </div>
            <div
              style={{
                fontSize: 62,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -2.6,
              }}
            >
              {site.name}
            </div>
            <div
              style={{ fontSize: 33, color: '#c9f31d', letterSpacing: -0.5 }}
            >
              {site.profession}
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                marginTop: 6,
              }}
            >
              {['Arquitetura', 'Full Stack', 'IA', 'Cloud', 'DevOps'].map(
                label => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      padding: '8px 13px',
                      border: '1px solid #39452f',
                      borderRadius: 8,
                      background: '#1b2418',
                      fontSize: 18,
                      color: '#d6dfca',
                    }}
                  >
                    {label}
                  </div>
                )
              )}
            </div>
            <div style={{ marginTop: 10, fontSize: 23, color: '#adb7a5' }}>
              Da ideia ao software em produção.
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #35402d',
            paddingTop: 22,
          }}
        >
          <div style={{ display: 'flex', gap: 26 }}>
            {contacts.map(({ name, icon: Icon }) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  color: '#d4ddcb',
                  fontSize: 18,
                }}
              >
                <Icon size={23} color="#c9f31d" />
                <span>{name}</span>
              </div>
            ))}
          </div>
          <div style={{ color: '#d4ddcb', fontSize: 21 }}>{site.email}</div>
        </div>
      </div>
    </div>
  );
}
