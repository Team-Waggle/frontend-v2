import { useMemo, useState } from 'react';
import type { TermResponse, TermType } from '../../types/api/term';
import { usePostTerms } from '../../hooks/useTerms';
import BaseButton from '../common/Button';

// Modals
import type { ModalProps } from '../../types/modal';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';
import { useModal } from '../../hooks/useModal';

// Icons
import CheckboxIcon from '../../assets/icons/normal/ic_checkbox.svg?react';
import CheckboxFillIcon from '../../assets/icons/normal/ic_checkbox_fill.svg?react';

interface TermsModalProps extends ModalProps {
  terms: TermResponse[];
}

const TERM_LABELS: Record<TermType, string> = {
  SERVICE: '서비스 이용약관',
  PRIVACY_COLLECT: '개인정보 수집 및 이용 동의',
  PRIVACY_THIRD_PARTY: '개인정보 제3자 제공 동의',
  PROFILE_DATA: '프로필·지원 정보 제공 동의',
  MARKETING: '마케팅 정보 수신동의',
};

const TermsModal = ({ isOpen, onClose, terms }: TermsModalProps) => {
  const [agreementOverrides, setAgreementOverrides] = useState<
    Partial<Record<TermType, boolean>>
  >({});
  const { mutate: postTerms, isPending } = usePostTerms();

  const agreements = useMemo(
    () =>
      terms.reduce(
        (nextAgreements, term) => ({
          ...nextAgreements,
          [term.type]: agreementOverrides[term.type] ?? term.agreed,
        }),
        {} as Record<TermType, boolean>,
      ),
    [agreementOverrides, terms],
  );

  useModal({
    isOpen,
    isOnboarding: true,
    onClose,
  });

  if (!isOpen) return null;

  const isAllAgreed =
    terms.length > 0 && terms.every(({ type }) => agreements[type]);
  const isRequiredAgreed =
    terms.length > 0 &&
    terms
      .filter(({ mandatory }) => mandatory)
      .every(({ type }) => agreements[type]);

  const handleAllAgreementChange = () => {
    const nextChecked = !isAllAgreed;

    setAgreementOverrides(
      terms.reduce(
        (nextAgreements, { type }) => ({
          ...nextAgreements,
          [type]: nextChecked,
        }),
        {} as Record<TermType, boolean>,
      ),
    );
  };

  const handleAgreementChange = (type: TermType) => {
    setAgreementOverrides((prevAgreements) => ({
      ...prevAgreements,
      [type]: !agreements[type],
    }));
  };

  const handleSubmit = () => {
    postTerms({
      agreements: terms.map(({ type }) => ({
        type,
        agreed: agreements[type],
      })),
    });
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <ModalOverlay onClose={onClose} isOnboarding />

        <div className="relative flex h-[69rem] w-[73.8rem] justify-center rounded-[2rem] bg-black-5 px-[4rem] pt-[4rem]">
          <div className="flex w-[65.8rem] flex-col gap-[3.4rem]">
            <span className="whitespace-pre-line text-[3rem] font-bold text-black-100">
              {'서비스 이용을 위해\n약관에 동의해 주세요'}
            </span>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex flex-col gap-[1rem]">
                <div className="border-b border-black-20 pb-[4rem]">
                  <input
                    id="agreement-all"
                    type="checkbox"
                    checked={isAllAgreed}
                    onChange={handleAllAgreementChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="agreement-all"
                    className="flex cursor-pointer gap-[0.8rem]"
                  >
                    <span className="flex h-[3.2rem] w-[3.2rem] items-center justify-center">
                      {isAllAgreed ? (
                        <CheckboxFillIcon width={20} height={20} />
                      ) : (
                        <CheckboxIcon width={20} height={20} />
                      )}
                    </span>
                    <span className="flex flex-1 flex-col gap-[0.8rem]">
                      <span className="text-[2rem] font-bold text-black-90">
                        모두 동의
                      </span>
                      <span className="text-[1.6rem] font-medium text-black-70">
                        전체 동의는 필수 및 선택 정보에 대한 동의도 포함되어
                        있으며, 개별적으로도 동의를 선택하실 수 있습니다.
                        선택항목에 대한 동의를 거부하시는 경우에도 서비스는
                        이용이 가능합니다.
                      </span>
                    </span>
                  </label>
                </div>

                {terms.map(({ id, type, contentUrl, mandatory }) => {
                  const inputId = `agreement-${id}`;
                  const isChecked = agreements[type];

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between py-[0.4rem]"
                    >
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={!!isChecked}
                        onChange={() => handleAgreementChange(type)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={inputId}
                        className="flex cursor-pointer items-center gap-[0.8rem]"
                      >
                        <span className="flex h-[3.2rem] w-[3.2rem] items-center justify-center">
                          {isChecked ? (
                            <CheckboxFillIcon width={20} height={20} />
                          ) : (
                            <CheckboxIcon width={20} height={20} />
                          )}
                        </span>
                        <span className="text-[1.8rem] font-medium text-black-90">
                          [{mandatory ? '필수' : '선택'}] {TERM_LABELS[type]}
                        </span>
                      </label>
                      <a
                        href={contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[1.6rem] font-medium text-black-70 underline"
                      >
                        보기
                      </a>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center pb-[3.8rem]">
                <BaseButton
                  size="xl"
                  disabled={!isRequiredAgreed || isPending}
                  onClick={handleSubmit}
                  className="w-[25rem]"
                >
                  시작하기
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default TermsModal;
