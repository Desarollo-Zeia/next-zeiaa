import styles from '@/app/ui/home.module.css';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Module } from './lib/definitions';
import Link from 'next/link';

function ModuleCard({ image, name, description, route } : Module ) {
  return (
    <div className='bg-white h-auto w-[300px] rounded-md'>
      <div className='w-full h-[80px] flex justify-center items-center p-4'>
        <div className='flex-1 flex justify-center'>
        <Image
          src={ image }
          width={40}
          height={40}
          className='object-contain'
          alt='co2 service'
        />
        </div>
        <div className='flex-1 flex justify-center items-center'>
        <p className='text-sm text-balance'>{ name }</p>
        </div>
      </div>
      <div className='h-[1px] w-[90%] bg-black mx-auto'></div>
      <div className='p-4 w-full h-[80px]'>
        <p className='text-xs text-balance'>{ description }</p>
      </div>
      <div className='h-[60px]'>
        <Link className={styles.buttonservice} href={route}>
          <div >
            <p className='text-xs'>Ingresar</p>
          </div>
          <div>
            <ArrowRight width={18} height={18}/>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className={styles.background}>  
      <Image
        src='/logozeia.png'
        width={120}
        height={80}
        className='p-4 absolute'
        alt='Logo zeia initial screen'
      />
      <div className='w-full flex justify-end items-center gap-4 p-8'>
        <ModuleCard image='/co2service.png' name='MONITOREO DE AGENTES CONTAMINANTES' description='Asegura un ambiente saludable controlando CO2, TVOC, HCHO, PM y luz en espacios interiores.' route='/agentescontaminantes'/>
        <ModuleCard image='/monitoreoservice.png' name='MONITOREO AMBIENTAL' description='Control avanzado de gases y agentes ambientales como PM, Cloro, Amoniaco entre otros, contribuyendo a disminuir la contaminación ambiental.' route='/ambiental'/>
      </div>
    </main>
  );
}
