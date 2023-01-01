<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../UserStories/Kontext/LoadKontext.php");

final class LoadKontextTest extends TestCase
{
    public function testLoadKontextWithId1()
    {
        $loadKontext = new LoadKontext();
        $loadKontext->setId(1);

        $this->assertTrue($loadKontext->run());
        $this->assertInstanceOf(Kontext::class, $loadKontext->getKontext());
    }
}